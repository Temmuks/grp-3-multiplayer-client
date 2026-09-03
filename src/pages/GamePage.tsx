import { useParams } from "react-router"

function GamePage() {
    const { gameRoomId } = useParams();
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