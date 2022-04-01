import { BlockWithUUID, Vector2 } from "./block";

export class Snake {
  uuid: string
  blocks: BlockWithUUID[]
  anchorPrev: Vector2
  constructor(args: Pick<Snake, 'uuid' | 'blocks' | 'anchorPrev'>) {
    this.uuid = args.uuid
    this.blocks = args.blocks
    this.anchorPrev = args.anchorPrev
  }
  get width() {
    return this.blocks.reduce((prev, current) => {
      return prev + current.width
    }, 0)
  }
  get anchorNext(): Vector2 {
    return [this.anchorPrev[0] + this.width, this.anchorPrev[1]]
  }
}
