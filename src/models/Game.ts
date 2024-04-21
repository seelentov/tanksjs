import Config from "../config/Config"
import Block from "./Block"
import GameMap from "./GameMap"
import Matrix from "./Matrix"
import Tank from "./Tank"
import PointService from '../services/PointService'
class Game {
    private matrix: Matrix<Block | Tank>
    private playerPos: IPoint
    private playerDir: IDirection
    private enemiesPos: ITankLittleData[]
    private gameInterval: ReturnType<typeof setInterval> | null
    private renderInterval: ReturnType<typeof setInterval> | null
    private lastInputCache: [string, string]
    constructor(gameMap: GameMap) {
        this.matrix = gameMap.matrix

        this.playerPos = gameMap.player.point
        this.playerDir = gameMap.player.direction
        this.enemiesPos = gameMap.enemies.map(item => {
            return {
                name: item.name,
                point: item.point
            }
        })

        this.gameInterval = null
        this.renderInterval = null

        this.lastInputCache = ['', '']
    }
    start() {
        this.gameInterval = setInterval(() => {
            this.tick()
        }, Config.game.gameIntervalMillisecs)
        this.renderInterval = setInterval(() => {
            this.render()
        }, Config.game.renderIntervalMillisecs)
    }
    rotateOrMove(direction: IDirection) {
        if (this.playerDir === direction) {
            this.playerPos = PointService.moveTo(this.playerPos, direction)
        } else {
            this.playerDir = direction
        }
    }
    checkInputAndDoAction() {
        if (!this.lastInputCache) return
        const key = this.lastInputCache.shift()


    }
    tick() {

    }
    input(inpt: string) {
        this.lastInputCache.push(inpt)
        if (this.lastInputCache.length > 2) this.lastInputCache.pop()
    }
    render() {
        console.log(this.matrix.map.map(line => line.map(item => item === null ? ' ' : item.icon)))
    }
}

export default Game