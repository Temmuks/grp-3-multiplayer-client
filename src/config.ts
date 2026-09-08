
// Consts



// Types
export type GameState = "NOT_STARTED" | "IN_PROGRESS" | "FINISHED"

export type GameRoomDisplayDTO = {
    gameRoomId: string,
    playerCount: number,
    maxPlayers: number,
    gridSize: number,
    gameRoomStatus: string
}

export type GameRoomJoinDTO = {
    playerId: string,
    gameRoomDisplayDTO: GameRoomDisplayDTO
}

export type PositionDTO = {
    x: number,
    y: number
}

export type PlayerUpdateDTO = {
    playerId: string,
    playerColor: string,
    positionDTO: PositionDTO,
}

export type GameRoomUpdateDTO = {
    gameRoomStatus: GameState,
    playerUpdateDTOList: PlayerUpdateDTO[]
}