///
type ITankOptionsWithPos = ITankOptions & {
    point: IPoint
}

type IPlayerTankOptions = ITankOptionsWithPos & {
    direction: IDirection
}

type IBlockOptionsWithPos = IBlockOptions & {
    point: IPoint
}

interface ITankLittleData {
    point: IPoint,
    name: string,
    direction: IDirection
}

type IBulletData = IBulletOptions & {
    point: IPoint
}

interface IGameMapOptions {
    height: number,
    width: number,
    player: IPlayerTankOptions,
    enemies: ITankOptionsWithPos[],
    blocks: IBlockOptionsWithPos[]
}