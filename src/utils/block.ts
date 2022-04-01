export type BlockTypes = 'promoter' | 'visibility'
export type BlockNames = 'T7 promoter' | 'mCherry'
export type BlockWithUUID = Block & { uuid: string }
export type Vector2 = [number, number]
export abstract class Block {
  abstract type: BlockTypes
  abstract name: BlockNames
  abstract width: number
  uuid?: string
  constructor(args: Pick<Block, 'uuid'>) {
    this.uuid = args.uuid
  }
}

export abstract class PromoterBlock extends Block {
  type: 'promoter' = 'promoter'
  constructor(args: Pick<Block, 'uuid'>) {
    super({
      uuid: args.uuid
    })
  }
}

export abstract class VisibilityBlock extends Block {
  type: 'visibility' = 'visibility'
  constructor(args: Pick<Block, 'uuid'>) {
    super({
      uuid: args.uuid
    })
  }
}

export type FinalBlock = {
  new(): Block;
}

export class T7PromoterBlock extends PromoterBlock {
  name: 'T7 promoter' = 'T7 promoter'
  width = 268.2
  constructor() {
    super({})
  }
}

export class MCherryBlock extends VisibilityBlock {
  name: 'mCherry' = 'mCherry'
  width = 268.2
  constructor() {
    super({})
  }
}
