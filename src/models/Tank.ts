import Bullet from "./Bullet"

class Tank {
    readonly name: string
    public hp: number
    public damage: number
    readonly icon: ITankIcon
    readonly type: 'enemy' | 'player'

    constructor(
        { hp, name, damage, icon, type }: ITankOptions
    ) {
        this.name = name
        this.hp = hp
        this.damage = damage
        this.icon = icon
        this.type = type
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
        return new Bullet(this.damage)
    }
}

export default Tank