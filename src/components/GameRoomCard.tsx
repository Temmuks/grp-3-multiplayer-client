import { useNavigate } from "react-router";
import type { GameRoomDisplayDTO } from "../config";
import useSound from "use-sound";

import pfffSfx from "../../sounds/pfff.mp3"

type GameRoomCardProps = {
  gameRoom: GameRoomDisplayDTO;
};

function GameRoomCard({ gameRoom }: GameRoomCardProps) {
  const navigate = useNavigate();
  const [joinSound] = useSound(pfffSfx);

  const onJoinHandler = () => {
    joinSound();
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
