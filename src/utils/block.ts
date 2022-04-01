export type BlockTypes = 'promoter' | 'visibility'
export type BlockNames = 'T7 promoter' | 'mCherry'
export type BlockWithUUID = Block & { uuid: string }
export type Vector2 = [number, number]
export abstract class Block {
  abstract type: BlockTypes
  abstract name: BlockNames
  location: Vector2
  uuid?: string
  constructor(args: Pick<Block, 'location' | 'uuid'>) {
    this.location = args.location
    this.uuid = args.uuid
  }
}

export abstract class PromoterBlock extends Block {
  type: 'promoter' = 'promoter'
  constructor(args: Pick<Block, 'location' | 'uuid'>) {
    super({
      location: args.location,
      uuid: args.uuid
    })
  }
}

export abstract class VisibilityBlock extends Block {
  type: 'visibility' = 'visibility'
  constructor(args: Pick<Block, 'location' | 'uuid'>) {
    super({
      location: args.location,
      uuid: args.uuid
    })
  }
}

export type FinalBlock = {
  new(location: Vector2): Block;
}

export class T7PromoterBlock extends PromoterBlock {
  name: 'T7 promoter' = 'T7 promoter'
  constructor(location: Vector2) {
    super({
      location
    })
  }
}

export class MCherryBlock extends VisibilityBlock {
  name: 'mCherry' = 'mCherry'
  constructor(location: Vector2) {
    super({
      location
    })
  }
}
