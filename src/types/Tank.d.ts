declare interface ITankOptions {
    readonly name: string,
    hp: number,
    damage: number,
    readonly icon: ITankIcon
    readonly type: 'enemy' | 'player'
}

interface ITankIcon {
    up: string,
    down: string,
    left: string,
    right: string;
}