import { useEffect, useState } from "react";
import GameRoomCard from "./GameRoomCard";
import { useWebSocket } from "../contexts/WebSocketContext";
import type { IMessage } from "@stomp/stompjs";
import type { GameRoomDisplayDTO } from "../config";

function GameRoomsList() {
  const client = useWebSocket();
  const [gameRooms, setGameRooms] = useState<GameRoomDisplayDTO[]>([]);

  // Vad som händer när ett meddelande från servern kommer hit från /topic/gamerooms
  function handleGameRoomsMessage(message: IMessage) {
    let gameRoomDisplayDTOs = JSON.parse(message.body);
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
      <button
        onClick={() => {
          fetch("http://localhost:8080/api/gameRooms", {
            method: "POST",
            body: localStorage.getItem("ClientId"),
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
