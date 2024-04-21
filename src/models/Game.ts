import Block from "./Block"
import GameMap from "./GameMap"
import Matrix from "./Matrix"
import Tank from "./Tank"

class Game {
    private matrix: Matrix<Block | Tank>
    private playerPos: IPoint
    private gameInterval: ReturnType<typeof setInterval> | null
    constructor(gameMap: GameMap) {
        this.matrix = gameMap.matrix
        this.playerPos = gameMap.player.point
        
        this.gameInterval = null
    }
}

export default Game