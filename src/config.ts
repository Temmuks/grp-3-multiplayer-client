// Consts

// Types
export type GameState = "NOT_STARTED" | "IN_PROGRESS" | "FINISHED";

export type GameRoomDisplayDTO = {
  gameRoomId: string;
  playerCount: number;
  maxPlayers: number;
  gridSize: number;
  gameRoomStatus: GameState;
  gameRoomOwner: string;
  winner: string;
  winnerColor: string;
};

export type GameRoomJoinDTO = {
  playerId: string;
  gameRoomDisplayDTO: GameRoomDisplayDTO;
  owner: boolean;
};

export type PositionDTO = {
  x: number;
  y: number;
};

export type PlayerUpdateDTO = {
  playerId: string;
  playerColor: string;
  positions: PositionDTO[];
};

export type GameRoomUpdateDTO = {
  gameRoomStatus: GameState;
  playerUpdateDTOList: PlayerUpdateDTO[];
};

export type SetGameRoomStatusDTO = {
  clientId: string;
  gameRoomId: string;
  gameState: GameState;
};
