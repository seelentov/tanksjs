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

}

export default new PointService()