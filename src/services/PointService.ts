class PointService {
    moveTo(point: IPoint, dir: IDirection): IPoint {
        switch (dir) {
            case 'up':
                return [point[0], point[1] - 1]
            case 'down':
                return [point[0], point[1] + 1]
            case 'left':
                return [point[0] - 1, point[1]]
            case 'right':
                return [point[0] + 1, point[1]]
        }
    }
    randPointBy(pointsArr: IPoint[]): IPoint{
        const random = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const randIndex = random(0, pointsArr.length - 1)

        return pointsArr[randIndex]
    }
    isDirection(from: IPoint, to: IPoint):IDirection | false{
        if (from[1] > to[1]){
            return 'up'
        } else if (from[1] < to[1]){
            return 'down'
        } else if (from[0] > to[0]){
            return 'left'
        } else if (from [0] < to[0]){
            return 'right'
        } else {
            return false
        }
    }

}

export default new PointService()