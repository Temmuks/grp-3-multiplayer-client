import { useNavigate } from "react-router";
import type { GameRoomDisplayDTO } from "../config";

type GameRoomCardProps = {
  gameRoom: GameRoomDisplayDTO;
};

function GameRoomCard({ gameRoom }: GameRoomCardProps) {
  const navigate = useNavigate();

  const onJoinHandler = () => {
    navigate("/game/" + gameRoom.gameRoomId);
  };

  return (
    <div className="gameroom-card">
      <h3>{gameRoom.gameRoomId}</h3>
      <p>
        Players: {gameRoom.playerCount}/{gameRoom.maxPlayers}
      </p>
      <p>Status: {gameRoom.gameRoomStatus}</p>
      <button onClick={onJoinHandler}>Gå med</button>
    </div>
  );
}

export default GameRoomCard;
