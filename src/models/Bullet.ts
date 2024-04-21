import Config from "../config/Config"

class Bullet {
    readonly icon: string
    constructor(
        public damage: number
    ) {
        this.icon = Config.icons.bullet
    }
}

export default Bullet