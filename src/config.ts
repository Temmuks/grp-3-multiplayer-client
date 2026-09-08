
// Consts



// Types
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