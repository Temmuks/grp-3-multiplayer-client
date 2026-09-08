import { useParams } from "react-router"
import { useWebSocket } from "../contexts/WebSocketContext";
import { useEffect, useState } from "react";
import type { IMessage } from "@stomp/stompjs";

function GamePage() {
    const { gameRoomId } = useParams();
    const client = useWebSocket();
    const [playerId, setPlayerId] = useState<string | null>(null)
    
    function handleGameRoomUpdate(message: IMessage){
        console.log("got message")
    }

    // Initial request to join the gameroom
    useEffect(() => {
        if (playerId != null){
            return
        }
        fetch(`http://localhost:8080/api/join/${gameRoomId}`, {
            method: "POST"
        })
        .then(response => response.text())
        .then(data => {
            setPlayerId(data);
        })
    })

    // Websocket subscription
    useEffect(() => {
        if (!client){
            return;
        }

        const subscription = client.subscribe(`/topic/game/${gameRoomId}`, handleGameRoomUpdate)

        return () => {
            subscription.unsubscribe()
        }
    }, [client])
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
        <canvas width={1000} height={1000}></canvas>
    </div>
  )
}

export default GamePage