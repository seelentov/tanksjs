import Block from "../models/Block"

class BlockService {
    generateBlock(options: IBlockOptions) {
        return new Block(options)
    }

}

export default new BlockService()