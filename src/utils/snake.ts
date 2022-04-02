import { BlockWithUUID, Vector2 } from "./block";

export class Snake {
  uuid: string
  blocks: BlockWithUUID[]
  anchorTail: Vector2
  constructor(args: Pick<Snake, 'uuid' | 'blocks' | 'anchorTail'>) {
    this.uuid = args.uuid
    this.blocks = args.blocks
    this.anchorTail = args.anchorTail
  }
  get width() {
    return this.blocks.reduce((prev, current) => {
      return prev + current.width
    }, 0)
  }
  get anchorNext(): Vector2 {
    return [this.anchorTail[0] + this.width, this.anchorTail[1]]
  }
}
