import DIRECTIONS from "../consts/DIRECTIONS"

class Matrix<T> {
    map: IMatrixMap<T>

    constructor(
        private height: number,
        private width: number
    ) {
        this.map = [[null]]
        this.clearAll()
    }

    private isSlotExist(x: number, y: number): boolean {
        return x >= 1 && x <= this.width && y >= 1 && y <= this.height
    }

    getSize(): number {
        return this.height * this.width
    }

    get(x: number, y: number): T | null | false {
        if (!this.isSlotExist(x, y)) return false
        return this.map[y - 1][x - 1]
    }

    push(x: number, y: number, data: T): T | null | false {
        if (!this.isSlotExist(x, y)) return false

        const line = [...this.map[y - 1]]
        line[x - 1] = data
        this.map[y - 1] = line

        return this.get(x - 1, y - 1)
    }

    fill(data: T | null) {
        this.map = Array(this.height).fill(Array(this.width).fill(data))
    }

    clear(x: number, y: number): boolean {
        if (!this.isSlotExist(x, y)) return false

        const line = [...this.map[y - 1]]
        line[x - 1] = null
        this.map[y - 1] = line
        return true
    }

    clearAll(): void {
        this.fill(null)
    }
    moveBy(point: IPoint, byX: MatrixMoveByDir, byY: MatrixMoveByDir): IMatrixResponse<T> {
        const item = this.get(...point) || null
        const wantPos: IPoint = [point[0] + byX, point[1] + byY]
        const onWantPos = this.get(...wantPos) || null

        if (item === null) {
            return {
                isMoved: false,
                actualPos: point,
                onActualPos: null,
                wantPos,
                onWantPos
            }
        }

        if (onWantPos) {
            return {
                isMoved: false,
                actualPos: point,
                onActualPos: item,
                wantPos,
                onWantPos
            }
        }

        this.push(...wantPos, item)
        this.clear(...point)

        return {
            isMoved: true,
            actualPos: wantPos,
            onActualPos: item,
            wantPos,
            onWantPos: item
        }
    }
    moveTo(point: IPoint, wantPos: IPoint): IMatrixResponse<T> {
        const item = this.get(...point) || null
        const onWantPos = this.get(...wantPos) || null

        if (item === null) {
            return {
                isMoved: false,
                actualPos: point,
                onActualPos: null,
                wantPos,
                onWantPos
            }
        }

        if (onWantPos) {
            return {
                isMoved: false,
                actualPos: point,
                onActualPos: item,
                wantPos,
                onWantPos
            }
        }

        this.push(...wantPos, item)
        this.clear(...point)

        return {
            isMoved: true,
            actualPos: wantPos,
            onActualPos: item,
            wantPos,
            onWantPos: item
        }
    }
    getDirs(point: IPoint) {
        const up: IPoint = [point[0], point[1] - 1]
        const down: IPoint = [point[0], point[1] + 1]
        const left: IPoint = [point[0] - 1, point[1]]
        const right: IPoint = [point[0] + 1, point[1]]

        const concatPoints: IPoint[] = [up, down, left, right]
        return concatPoints.filter(point => this.isSlotExist(...point))
    }
    getEmptyDirs(point: IPoint) {
        return this.getDirs(point).filter(point => this.get(...point) === null)
    }
    getPath(from: IPoint, to: IPoint, ignore?: (arg0: T) => boolean): IPoint[] {
        const visited: Set<string> = new Set();
        const queue: IPoint[][] = [[from]];

        while (queue.length > 0) {
            const path = queue.shift() as IPoint[];
            const current = path[path.length - 1];

            if (current[0] === to[0] && current[1] === to[1]) {
                return path;
            }

            const dirs = this.getDirs(current);

            for (const dir of dirs) {
                if (dir[0] === to[0] && dir[1] === to[1]) {
                    return path;
                }
                const key = dir.join(",");
                if (!visited.has(key)) {
                    visited.add(key);
                    const newData = this.get(dir[0], dir[1]);
                    if (newData === null || (newData && ignore && ignore(newData))) {
                        queue.push([...path, dir]);
                    }
                }
            }
        }

        return [];
    }
    onRow(point: IPoint): (T | null)[] {
        const result = []
        for (let i = 1; i <= this.width; i++) {
            if (i !== point[0]) {
                result.push(this.get(i, point[1]) as (T | null))
            } else {
                result.push(null)
            }
        }
        return result
    }
    onColumn(point: IPoint): (T | null)[] {
        const result = []
        for (let i = 1; i <= this.height; i++) {
            if (i !== point[1]) {
                result.push(this.get(point[0], i) as (T | null))
            } else {
                result.push(null)
            }
        }
        return result
    }
    onDirection(point: IPoint, direction: IDirection):(T | null)[] {
        if (direction === 'up' || direction === 'down') {
            const column = this.onColumn(point)
            return direction === 'up' ? column.slice(0, point[1] - 1).reverse() : column.slice(point[1],)
        } else {
            const row = this.onRow(point)

            return direction === 'left' ? row.slice(0, point[0] - 1).reverse() : row.slice(point[0],)
        }
    }
    onDirections(point: IPoint): IMatrinOnDirections<T> {
        const result: any  = {}
        DIRECTIONS.forEach(direction => {
            result[direction] = this.onDirection(point, direction)
        })
        return result
    }
    firstOnDirection(point: IPoint, direction: IDirection): IMatrixFirstOnDirection<T>{
        const isVertical = direction === 'down' || direction === 'up'
        return this.onDirection(point, direction)
            .map((data, index) => {
                const thisPoint: IPoint = isVertical ? [point[0], index + 1] : 
                [index + 1, point[1]]
                return {
                    data,
                    point: thisPoint
                }
            })
            .filter((item) => item.data !== null)[0]
    }
    firstOnDirections(point: IPoint): IMatrixFirstOnDirections<T>{
        const result: any  = {}
        DIRECTIONS.forEach(direction => {
            result[direction] = this.firstOnDirection(point, direction)
        })
        return result
    }
}

export default Matrix