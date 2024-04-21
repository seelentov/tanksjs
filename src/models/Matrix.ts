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
        return !!this.map[y][x]
    }

    getSize(): number {
        return this.height * this.width
    }

    get(x: number, y: number): T | null | false {
        if (!this.isSlotExist(x, y)) return false
        return this.map[y][x]
    }

    push(x: number, y: number, data: T): T | null | false {
        if (!this.isSlotExist(x, y)) return false
        this.map[y][x] = data
        return this.get(x, y)
    }

    fill(data: T | null) {
        this.map = Array(this.height).fill(Array(this.width).fill(data))
    }

    clear(x: number, y: number): boolean {
        if (!this.isSlotExist(x, y)) return false
        this.map[y][x] = null
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
}

export default Matrix