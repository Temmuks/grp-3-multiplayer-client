import { useParams } from "react-router";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useEffect, useRef, useState } from "react";
import type { IMessage } from "@stomp/stompjs";
import type { GameRoomJoinDTO, PlayerUpdateDTO, PositionDTO } from "../config";
import CircleComponent from "../components/CircleComponent";

function GamePage() {
  const api = import.meta.env.VITE_API_URL ?? "";

  const { gameRoomId } = useParams();
  const client = useWebSocket();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState<number>(200);
  const initialized = useRef(false);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [playerColor, setPlayerColor] = useState<string>("");
  const [winnerColor, setWinnerColor] = useState<string>("");

  // resolution of the canvas, not the actual rendered size
  const canvasWidth = 1000;

  // source: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvas = canvasRef.current;
  let context = canvas?.getContext("2d");

  function handleGameRoomUpdate(message: IMessage) {
    // TODO: add calls to drawPixel with player's new positions
    // console.log("got message")

    setWinnerColor(JSON.parse(message.body).winnerColor);

    JSON.parse(message.body).playerUpdateDTOList.forEach(
      (playerUpdateDTO: PlayerUpdateDTO) => {
        playerUpdateDTO.positions.forEach((positionDTO: PositionDTO) => {
          drawPixel(positionDTO.x, positionDTO.y, playerUpdateDTO.playerColor);
        });

        // console.log("PLAYER POS X:" + playerUpdateDTO.positionDTO.x);
        // console.log("PLAYER POS Y:" + playerUpdateDTO.positionDTO.y);
        // console.log("PLAYER Color:" + playerUpdateDTO.playerColor);
      },
    );
  }

  function drawPixel(x: number, y: number, color: string) {
    const pixelWidth = canvasWidth / gridSize;
    if (!context) return;
    context.fillStyle = color;

    context.fillRect(x * pixelWidth, y * pixelWidth, pixelWidth, pixelWidth);
    console.log(gridSize);
  }

  // Initial request to join the gameroom
  //För att förhindra att vi får en dubbel join så implementerade vi en initializer.
  //Se referens:
  //https://taig.medium.com/prevent-react-from-triggering-useeffect-twice-307a475714d7
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (playerId != null) {
        return;
      } else {
        fetch(`${api}/api/join/${gameRoomId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(localStorage.getItem("ClientId")),
        })
          .then((response) => response.json())
          .then((dto: GameRoomJoinDTO) => {
            setPlayerId(dto.playerId);
            setGridSize(dto.gameRoomDisplayDTO.gridSize);
            setIsOwner(dto.owner);
            setPlayerColor(dto.playerColor);
          });
      }
      console.log(playerId);
    }
  }, []);

  useEffect(() => {
    canvas = canvasRef.current;
    context = canvas?.getContext("2d");
  }, []);
  // Websocket subscription
  useEffect(() => {
    if (!client) {
      return;
    }

    const subscription = client.subscribe(
      `/topic/game/${gameRoomId}`,
      handleGameRoomUpdate,
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [client, gridSize]);

  //Turn
  useEffect(() => {
    if (!client || !playerId || !gameRoomId) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      let direction = "";

      if (event.key === "ArrowUp") {
        direction = "up";
      } else if (event.key === "ArrowDown") {
        direction = "down";
      } else if (event.key === "ArrowLeft") {
        direction = "left";
      } else if (event.key === "ArrowRight") {
        direction = "right";
      }

      if (direction !== "" && client) {
        client.publish({
          destination: "/app/turn",
          body: JSON.stringify({
            playerId: playerId,
            direction: direction,
            gameRoomId: gameRoomId,
          }),
        });
      }

      if (event.key == " " && client) {
        client.publish({
          destination: "/app/dash",
          body: JSON.stringify({
            playerId: playerId,
            gameRoomId: gameRoomId,
          }),
        });
      }
    }

    // Here you could for examplge add some "electricity/charge" sound for successfull dash.
    // Maybe some "bounce" sound for successful jump

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [client, playerId, gameRoomId]);

  //Startar spelet
  const onStartHandler = () => {
    fetch(api + "/api/gameroom/start", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: localStorage.getItem("ClientId"),
        gameRoomId: gameRoomId,
        gameState: "IN_PROGRESS",
      }),
    });
    setIsStarted(true);
  };

  return (
    <div>
      <h1>Game Page</h1>
      {playerColor ? (
        <div>
          <p>Your color is: </p>
          <CircleComponent color={playerColor} />
        </div>
      ) : (
        <p>You don't have a player ID.</p>
      )}

      {gameRoomId ? (
        <p>Game Room ID: {gameRoomId}</p>
      ) : (
        <p>No Game Room ID was entered in URL</p>
      )}
      {isOwner && !isStarted ? (
        <button onClick={onStartHandler}>Start</button>
      ) : (
        <p>Waiting for host to start</p>
      )}
      {/* Skriver ut vinnarens färg */}
      {winnerColor ? <h2>The winner is: {winnerColor}</h2> : <p></p>}

      <div className="circle" style={{ background: winnerColor }}></div>
      <canvas
        className="game-window"
        width={canvasWidth}
        height={canvasWidth}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}

export default GamePage;
