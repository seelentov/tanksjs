type ITankOptionsWithPos = ITankOptions & {
    point: IPoint
}

type IPlayerTankOptions = ITankOptionsWithPos & {
    direction: IDirection
}

type IBlockOptionsWithPos = IBlockOptions & {
    point: IPoint
}

type ITankLittleData = {
    point: IPoint,
    name: string
}

interface IGameMapOptions {
    height: number,
    width: number,
    player: IPlayerTankOptions,
    enemies: ITankOptionsWithPos[],
    blocks: IBlockOptionsWithPos[]
}