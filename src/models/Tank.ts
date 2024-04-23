import Bullet from "./Bullet"

class Tank {
    readonly name: string
    public hp: number
    public damage: number
    readonly icon: ITankIcon
    readonly type: 'enemy' | 'player'
    public direction: IDirection

    constructor(
        { hp, name, damage, icon, type, direction}: ITankOptions
    ) {
        this.name = name
        this.hp = hp
        this.damage = damage
        this.icon = icon
        this.type = type
        this.direction = direction || 'up'

    }

    public heal(value: number): void {
        this.hp += value
    }
    public upgrade(value: number): void {
        this.damage += value
    }
    public takeDamage(value: number): void {
        this.hp -= value
    }
    public shoot(): Bullet {
        return new Bullet({damage: this.damage, direction: this.direction})
    }
    public rotate(direction: IDirection): void{
        this.direction = direction
    }
}

export default Tank