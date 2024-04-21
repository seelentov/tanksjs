class Block {
    public name: string
    public hp: number
    readonly icon: string
    constructor(
        { name, hp, icon }: IBlockOptions
    ) {
        this.name = name || 'block'
        this.hp = hp
        this.icon = icon
    }
    public takeDamage(value: number): void {
        this.hp -= value
    }
}

export default Block