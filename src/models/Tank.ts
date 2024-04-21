import Bullet from "./Bullet"

class Tank {
    readonly name: string
    public hp: number
    public damage: number
    readonly icon: ITankIcon

    constructor(
        { hp, name, damage, icon }: ITankOptions
    ) {
        this.name = name || 'tank'
        this.hp = hp
        this.damage = damage
        this.icon = icon
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