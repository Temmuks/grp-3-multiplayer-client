import type { GameRoomDisplayDTO } from "../config"

type GameRoomCardProps = {
    gameRoom: GameRoomDisplayDTO
}

function GameRoomCard({ gameRoom }: GameRoomCardProps) {
  return (
    <div className="gameroom-card">
        <h3>{gameRoom.gameRoomId}</h3>
        <p>Players: {gameRoom.playerCount}/{gameRoom.maxPlayers}</p>
        <p>Status: {gameRoom.gameRoomStatus}</p>
    </div>
  )
}

export default GameRoomCard