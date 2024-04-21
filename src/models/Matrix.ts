
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
    getDirs(point: IPoint) {
        const up: IPoint = [point[0], point[1] - 1]
        const down: IPoint = [point[0], point[1] + 1]
        const left: IPoint = [point[0] - 1, point[1]]
        const right: IPoint = [point[0] + 1, point[1]]

        const concatPoints: IPoint[] = [up, down, left, right]
        return concatPoints.filter(point => this.isSlotExist(...point))
    }
    getPath(from: IPoint, to: IPoint): IPoint[] {
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
                const key = dir.join(",");
                if (!visited.has(key)) {
                    visited.add(key);
                    const newData = this.get(dir[0], dir[1]);
                    if (newData === null) {
                        queue.push([...path, dir]);
                    }
                }
            }
        }

        return [];
    }
}

export default Matrix