///
type IMatrixMap<T> = (T | null)[][]
type IMatrixResponse<T> = {
    actualPos: IPoint,
    onActualPos: T | null
    wantPos: IPoint,
    onWantPos: T | null
    isMoved: boolean
}

type IMatrinOnDirections<T> = {[key: IDirection]: (T | null)[]}
type IMatrixFirstOnDirection<T> = {data:  (T | null), point: IPoint}
type IMatrixFirstOnDirections<T> = {[key: IDirection]: IMatrixFirstOnDirection<T>} 


type MatrixMoveByDir = -1 | 0 | 1