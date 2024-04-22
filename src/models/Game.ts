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
    private bullets: IBulletData[]
    private gameMap: GameMap
    constructor(gameMap: GameMap) {
        this.gameMap = gameMap
        this.matrix = this.gameMap.matrix

        this.playerPos = this.gameMap.player.point
        this.playerDir = this.gameMap.player.direction
        this.enemiesPos = this.gameMap.enemies.map(item => {
            return {
                name: item.name,
                point: item.point,
                direction: 'down',
                icon: item.icon
            }
        })

        this.bullets = []

        this.gameInterval = null
        this.renderInterval = null

        this.lastInputCache = ['', '']
    }
    start() {
        this.gameInterval = setInterval(() => {
            this.tick()
        }, Config.game.gameIntervalMillisecs)
        this.renderInterval = setInterval(() => {
            // console.clear()
            this.render()
        }, Config.game.gameIntervalMillisecs)
    }
    rotateOrMovePlayer(direction: IDirection) {
        if (this.playerDir === direction) {
            this.playerPos = PointService.moveTo(this.playerPos, direction)
        } else {
            this.playerDir = direction
        }
    }
    moveEnemies() {
        this.enemiesPos.forEach((enemy, index) => {
            const move = (newPoint: IPoint) => {
                const newDir = PointService.isDirection(enemy.point, newPoint)
                if (newDir && newDir !== enemy.direction) {
                    this.enemiesPos[index].direction = newDir
                } else if (this.matrix.get(...newPoint) === null) {
                    this.matrix.moveTo(enemy.point, newPoint)
                    this.enemiesPos[index].direction = newDir || enemy.direction
                    this.enemiesPos[index].point = newPoint
                }
            }

            const path = this.matrix.getPath(enemy.point, this.playerPos, (item) => item instanceof Tank)
            if (path.length < 1) {
                const emptyDirs = this.matrix.getEmptyDirs(enemy.point)
                const randDir = PointService.randPointBy(emptyDirs)
                if(randDir) move(randDir)
            }
            else if (path.length > 1) {
                move(path[1])
            }
        })
    }
    shootEnemies(){
        
    }
    checkInputAndDoAction() {
        if (!this.lastInputCache) return
        // const key = this.lastInputCache.shift()
    }
    tick() {
        this.moveEnemies()
    }
    input(inpt: string) {
        this.lastInputCache.push(inpt)
        if (this.lastInputCache.length > 2) this.lastInputCache.pop()
    }
    render() {
        const renderMatrix = this.matrix.map.map(line => line.map(item => {
            if (item === null) {
                return Config.icons.empty
            } else if (typeof item.icon === 'string') {
                return item.icon
            }
        })).slice()

        const [playerX, playerY] = this.playerPos
        renderMatrix[playerY - 1][playerX - 1] = this.gameMap.player.icon[this.playerDir]

        this.enemiesPos.forEach(enemy => {
            const [enemyX, enemyY] = enemy.point
            renderMatrix[enemyY - 1][enemyX - 1] = enemy.icon[enemy.direction]
        })

        console.log(renderMatrix)

    }
}

export default Game