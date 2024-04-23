import Config from "../config/Config"
import Block from "./Block"
import GameMap from "./GameMap"
import Matrix from "./Matrix"
import Tank from "./Tank"
import PointService from '../services/PointService'
import Bullet from "./Bullet"

class Game {
    private matrix: Matrix<Block | Tank | Bullet>
    private gameInterval: ReturnType<typeof setInterval> | null
    private renderInterval: ReturnType<typeof setInterval> | null
    private lastInputCache: [string, string]
    private gameMap: GameMap
    private gameTick: number
    private status: IGameStatus
    constructor(gameMap: GameMap) {
        this.gameMap = gameMap
        this.matrix = this.gameMap.matrix

        this.status = 'pending'

        this.gameInterval = null
        this.renderInterval = null

        this.gameTick = 0

        this.lastInputCache = ['', '']
    }
    async start() {
        this.status = 'play'
        this.renderInterval = setInterval(()=>{
            console.clear()
            this.render()
        }, Config.game.renderIntervalMillisecs)
        for (; ;) {
            if(this.status !== 'play') break
            this.tick()
            await new Promise(resolve => setTimeout(resolve, Config.game.gameIntervalMillisecs));     
        }
    }
    rotateOrMovePlayer(direction: IDirection) {
        const playerFindData = this.matrix.find((item => item instanceof Tank && (item?.type === 'player')))

        if (!playerFindData || !(playerFindData.data instanceof Tank)) return

        const { data: playerTank, point: playerPoint } = playerFindData

        const newPoint = PointService.moveTo(playerPoint, direction)

        if (playerTank.direction === direction && this.matrix.isSlotExist(...newPoint)) {
            this.matrix.moveTo(playerPoint, newPoint)
        } else {
            playerTank.rotate(direction)
        }
    }
    restart(){
        this.matrix = this.gameMap.matrix
        this.status = 'pending'
        this.gameInterval = null
        this.renderInterval = null
        this.gameTick = 0
        this.lastInputCache = ['', '']
        this.start()
    }
    moveEnemies() {
        const enemyMoveModifierTick = 1 / Config.game.enemyMoveModifier
        if(this.gameTick % enemyMoveModifierTick !== 0) return 

        const playerFindData = this.matrix.find((item => item instanceof Tank && (item?.type === 'player')))

        if (!playerFindData || !(playerFindData.data instanceof Tank)) return

        const { point: playerPoint } = playerFindData


        this.matrix.filter((item) => item instanceof Tank && (item?.type === 'enemy')).forEach((enemyFindData) => {

            if (!enemyFindData || !(enemyFindData?.data instanceof Tank)) return

            const { data: enemyTank, point: enemyPoint } = enemyFindData


            const move = (newPoint: IPoint) => {
                const newDir = PointService.isDirection(enemyPoint, newPoint)
                if (newDir && newDir !== enemyTank.direction) {
                    enemyTank.rotate(newDir)
                } else if (this.matrix.get(...newPoint) === null) {
                    this.matrix.moveTo(enemyPoint, newPoint)
                    if (newDir) enemyTank.rotate(newDir)
                }
            }

            const path = this.matrix.getPath(enemyPoint, playerPoint, (item) => item instanceof Tank || item instanceof Bullet)
            if (path.length < 1) {
                const emptyDirs = this.matrix.getEmptyDirs(enemyPoint)
                const randDir = PointService.randPointBy(emptyDirs)
                if (randDir) move(randDir)
            }
            else if (path.length > 1) {
                move(path[1])
            }
        })
    }
    shoot(tankFindData: false | IMatrixFindItem<Block | Tank | Bullet>) {
        if (!tankFindData || !(tankFindData.data instanceof Tank)) return

        const { data: tank, point: tankPosition } = tankFindData

        const shootPoint = PointService.moveTo(tankPosition, tank.direction)

        const itemOnShootPoint = this.matrix.get(...shootPoint)

        if (itemOnShootPoint instanceof Tank || itemOnShootPoint instanceof Block) {
            itemOnShootPoint.takeDamage(tank.damage)
            if (itemOnShootPoint.hp <= 0) this.matrix.clear(...shootPoint)
        } else {
            const bullet = tank.shoot()
            this.matrix.push(...shootPoint, bullet)
        }
    }
    shootEnemies() {
        const enemyMoveModifierTick = 1 / Config.game.enemyMoveModifier
        if(this.gameTick % enemyMoveModifierTick !== 0) return 

        this.matrix.filter((item) => item instanceof Tank && (item?.type === 'enemy')).forEach((enemyFindData) => {

            if (!enemyFindData || !(enemyFindData?.data instanceof Tank)) return

            const { data: enemyTank, point: enemyPoint } = enemyFindData

            const isTick = this.gameTick % 5 === 0
            const firstOnDirection = this.matrix.firstOnDirection(enemyPoint, enemyTank.direction)?.data
            const isPlayerOnHorizon = firstOnDirection instanceof Tank && firstOnDirection.type === 'player'

            if (isTick || isPlayerOnHorizon) {
                this.shoot(enemyFindData)
            }
        })
    }
    moveBullets() {
        this.matrix.filter((item) => item instanceof Bullet).forEach((bulletFindData) => {
            if (!bulletFindData || !(bulletFindData.data instanceof Bullet)) return

            const { data: bullet, point: bulletPoint } = bulletFindData

            const shootPoint = PointService.moveTo(bulletPoint, bullet.direction)
            const itemOnShootPoint = this.matrix.get(...shootPoint)
            if (itemOnShootPoint instanceof Tank || itemOnShootPoint instanceof Block) {
                itemOnShootPoint.takeDamage(bullet.damage)
                if (itemOnShootPoint.hp <= 0) {
                    this.matrix.clear(...shootPoint)
                }
                this.matrix.clear(...bulletPoint)
            } else {
                this.matrix.moveBy(bulletPoint, bullet.direction)
            }
        })
    }
    checkInputAndDoAction() {
        if (!this.lastInputCache) return
        // const key = this.lastInputCache.shift()
    }
    action(){
        const key = this.lastInputCache.shift()
        if(!key) return
        const {moveDown, moveLeft, moveRight, moveUp} = Config.input
        const {restart, shoot} = Config.input

        if (moveUp.includes(key)){
            this.rotateOrMovePlayer('up')
        } else if (moveDown.includes(key)){
            this.rotateOrMovePlayer('down')
        } else if (moveLeft.includes(key)){
            this.rotateOrMovePlayer('left')
        } else if (moveRight.includes(key)){
            this.rotateOrMovePlayer('right')
        } else if (restart.includes(key)) {
            this.restart()
        } else if (shoot.includes(key)) {
            const playerFindData = this.matrix.find((item => item instanceof Tank && (item?.type === 'player')))
            this.shoot(playerFindData)
        }
    }
    input(inpt: string) {
        this.lastInputCache.push(inpt)
        if (this.lastInputCache.length > 1) this.lastInputCache.pop()
    }
    tick() {
        this.action()
        this.moveBullets()
        this.shootEnemies()
        this.moveEnemies()
        this.gameTick += 1
    }
    render() {
        const renderMatrix = this.matrix.map.map(line => line.map(item => {
            if (item === null) {
                return Config.icons.empty
            } else if (typeof item.icon === 'string') {
                return item.icon
            }
        })).slice()

        const playerFindData = this.matrix.find((item => item instanceof Tank && (item?.type === 'player')))

        if (!playerFindData || !(playerFindData.data instanceof Tank)) return

        const { data: playerTank, point: playerPoint } = playerFindData

        const [playerX, playerY] = playerPoint
        renderMatrix[playerY - 1][playerX - 1] = playerTank.icon[playerTank.direction]


        this.matrix.filter((item) => item instanceof Tank && (item?.type === 'enemy')).forEach((enemyFindData) => {

            if (!enemyFindData || !(enemyFindData?.data instanceof Tank)) return

            const { data: enemyTank, point: enemyPoint } = enemyFindData

            const [enemyX, enemyY] = enemyPoint
            renderMatrix[enemyY - 1][enemyX - 1] = enemyTank.icon[enemyTank.direction]
        })

        const stringiryRenderMatrix = renderMatrix.map(line => '|' + line.join(' ') + '|').join('\n')

        const renderLine = () => console.log('--'.repeat(this.matrix.width) + '-')

        renderLine()
        console.log(stringiryRenderMatrix)
        renderLine()

    }
}

export default Game