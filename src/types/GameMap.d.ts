type ITankOptionsWithPos = ITankOptions & {
    point: IPoint
}

type IBlockOptionsWithPos = IBlockOptions & {
    point: IPoint
}



interface IGameMapOptions {
    height: number,
    width: number,
    player: ITankOptionsWithPos,
    enemies: ITankOptionsWithPos[],
    blocks: IBlockOptionsWithPos[]
}