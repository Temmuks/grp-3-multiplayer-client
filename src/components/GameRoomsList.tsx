import { useEffect, useState } from "react";
import GameRoomCard from "./GameRoomCard";
import { useWebSocket } from "../contexts/WebSocketContext";
import type { IMessage } from "@stomp/stompjs";
import type { GameRoomDisplayDTO } from "../config";

function GameRoomsList() {
  const client = useWebSocket();
  const [gameRooms, setGameRooms] = useState<GameRoomDisplayDTO[]>([]);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const maxPlayerOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  // Vad som händer när ett meddelande från servern kommer hit från /topic/gamerooms
  function handleGameRoomsMessage(message: IMessage) {
    let gameRoomDisplayDTOs: GameRoomDisplayDTO[] = JSON.parse(message.body);
    setGameRooms(gameRoomDisplayDTOs);
    // console.log(JSON.parse(message.body))
  }

  // Vid mount av component, subcribea till /topic/gamerooms
  // via client som ges i WebSocketContexten
  useEffect(() => {
    if (!client) {
      return;
    }

    const subscription = client.subscribe(
      "/topic/gamerooms",
      handleGameRoomsMessage,
    );
    //https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID
    localStorage.setItem("ClientId", self.crypto.randomUUID());
    return () => {
      subscription.unsubscribe();
    };
  }, [client]);

  return (
    <div>
      <h3>Game list</h3>
      {/* test bara */}
      <label>Max players</label>
      <select
        value={maxPlayers}
        onChange={(e) => setMaxPlayers(Number(e.target.value))}
      >
        {maxPlayerOptions.map((number) => (
          <option key={number} value={number}>
            {number}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          fetch("http://localhost:8080/api/gameRooms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              clientId: localStorage.getItem("ClientId"),
              maxPlayers: maxPlayers,
            }),
          });
        }}
      >
        skapa
      </button>
      <div>
        {gameRooms.map((gameRoom) => (
          <GameRoomCard gameRoom={gameRoom} key={gameRoom.gameRoomId} />
        ))}
      </div>
    </div>
  );
}

export default GameRoomsList;
