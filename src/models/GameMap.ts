import Block from "./Block"
import Matrix from "./Matrix"
import Tank from "./Tank"

class GameMap {
    private height: number
    private width: number
    public player: IPlayerTankOptions
    public enemies: ITankOptionsWithPos[]
    private blocks: IBlockOptionsWithPos[]
    public matrix: Matrix<Tank | Block>

    constructor(
        { height, width, player, enemies, blocks }: IGameMapOptions
    ) {
        this.height = height
        this.width = width
        this.player = player
        this.enemies = enemies
        this.blocks = blocks
        this.matrix = this.renderMatrix()
    }
    private renderMatrix() {
        const matrix = new Matrix<Tank | Block>(this.height, this.width)

        const { point: playerPoint, ...playerOptions } = this.player

        const playerTank = new Tank({ ...playerOptions, type: 'player' })
        matrix.push(...playerPoint, playerTank)

        this.enemies.forEach(enemy => {
            const { point: enemyPoint, ...enemyOptions } = enemy

            const enemyTank = new Tank({ ...enemyOptions, type: 'enemy' })

            matrix.push(...enemyPoint, enemyTank)
        })

        this.blocks.forEach(block => {
            const { point: blockPoint, ...blockOptions } = block

            const enemyTank = new Block(blockOptions)

            matrix.push(...blockPoint, enemyTank)
        })

        return matrix
    }
}

export default GameMap