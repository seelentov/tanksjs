import Config from "../config/Config"

class Bullet {
    readonly icon: string
    public damage: number
    public direction: IDirection
    constructor(
        {damage, direction}: IBulletOptions
    ) {
        this.icon = Config.icons.bullet
        this.damage = damage
        this.direction = direction
    }
}

export default Bullet