import { useParams } from "react-router";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useEffect, useRef, useState } from "react";
import type { IMessage } from "@stomp/stompjs";
import type { GameRoomJoinDTO } from "../config";

function GamePage() {
  const { gameRoomId } = useParams();
  const client = useWebSocket();
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState<number>(200);
  const initialized = useRef(false);

  // resolution of the canvas, not the actual rendered size
  const canvasWidth = 1000;

  // source: https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvas = canvasRef.current;
  let context = canvas?.getContext("2d");

  function handleGameRoomUpdate(message: IMessage) {
    // TODO: add calls to drawPixel with player's new positions
    // console.log("got message")

    JSON.parse(message.body).playerUpdateDTOList.forEach((player) => {
      drawPixel(player.positionDTO.x, player.positionDTO.y, player.playerColor);

      console.log("PLAYER POS X:" + player.positionDTO.x);
      console.log("PLAYER POS Y:" + player.positionDTO.y);
      console.log("PLAYER Color:" + player.playerColor);
    });
  }

  function drawPixel(x: number, y: number, color: string) {
    const pixelWidth = canvasWidth / gridSize;
    if (!context) return;
    context.fillStyle = color;

    context.fillRect(x * pixelWidth, y * pixelWidth, pixelWidth, pixelWidth);
  }

  useEffect(() => {
    canvas = canvasRef.current;
    context = canvas?.getContext("2d");
  });

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
        fetch(`http://localhost:8080/api/join/${gameRoomId}`, {
          method: "POST",
        })
          .then((response) => response.json())
          .then((dto: GameRoomJoinDTO) => {
            setPlayerId(dto.playerId);
            setGridSize(dto.gameRoomDisplayDTO.gridSize);
          });
      }
    }
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
  }, [client]);

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
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [client, playerId, gameRoomId]);


  return (
    <div>
      <h1>Game Page</h1>
      {playerId ? (
        <p>My player ID is {playerId}.</p>
      ) : (
        <p>You don't have a player ID.</p>
      )}

      {gameRoomId ? (
        <p>Game Room ID: {gameRoomId}</p>
      ) : (
        <p>No Game Room ID was entered in URL</p>
      )}
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
