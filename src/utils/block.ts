export type BlockTypes = 'promoter' | 'visible'
export type BlockWithUUID = Block & { uuid: string }
export abstract class Block {
  abstract type: BlockTypes
  location: [number, number]
  uuid?: string
  constructor(args: Pick<Block, 'location' | 'uuid'>) {
    this.location = args.location
    this.uuid = args.uuid
  }
}

export class PromoterBlock extends Block {
  type: 'promoter' = 'promoter'
  promoterName: string
  constructor(args: Pick<PromoterBlock, 'promoterName' | 'location' | 'uuid'>) {
    super({
      location: args.location,
      uuid: args.uuid
    })
    this.promoterName = args.promoterName
  }
}
