import Tank from "../models/Tank"

class TankSerice {
    generateTank(options: ITankOptions) {
        return new Tank(options)
    }

}

export default new TankSerice()