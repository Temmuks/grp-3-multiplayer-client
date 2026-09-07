import { useParams } from "react-router"
import { useWebSocket } from "../contexts/WebSocketContext";
import { useEffect } from "react";
import type { IMessage } from "@stomp/stompjs";

function GamePage() {
    const { gameRoomId } = useParams();
    const client = useWebSocket();

    function handleGameRoomUpdate(message: IMessage){
        console.log("got message")
    }

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
        {gameRoomId ? (
            <p>Game Room ID: {gameRoomId}</p>
        ) : (
            <p>No Game Room ID was entered in URL</p>
        )}
    </div>
  )
}

export default GamePage