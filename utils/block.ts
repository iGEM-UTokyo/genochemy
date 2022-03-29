export type BlockTypes = 'promoter' | 'visible'
export abstract class Block {
  abstract type: BlockTypes;
  constructor(
    public location: [number, number],
    // 他ブロックとの接続など
  ) { }
}

export class PromoterBlock extends Block {
  type: 'promoter' = 'promoter'
  constructor(
    public promoterName: string,
    location: [number, number],
  ) {
    super(location)
  }
}
