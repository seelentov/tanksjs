///
type IMatrixMap<T> = (T | null)[][]
type IMatrixResponse<T> = {
    actualPos: IPoint,
    onActualPos: T | null
    wantPos: IPoint,
    onWantPos: T | null
    isMoved: boolean
}

type MatrixMoveByDir = -1 | 0 | 1