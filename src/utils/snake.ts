import { BlockWithUUID, Vector2 } from "./block";

export const overlap = 9
export class Snake {
  uuid: string
  blocks: BlockWithUUID[]
  anchorTail: Vector2
  constructor(args: Pick<Snake, 'uuid' | 'blocks' | 'anchorTail'>) {
    this.uuid = args.uuid
    this.blocks = args.blocks
    this.anchorTail = args.anchorTail
  }
  static copy(snake: Snake) {
    return new Snake({
      uuid: snake.uuid,
      blocks: snake.blocks,
      anchorTail: [snake.anchorTail[0], snake.anchorTail[1]]
    })
  }
  get width() {
    return this.blocks.reduce((prev, current) => {
      if (prev === 0) {
        return prev + current.width
      }
      // consider overlaps
      return prev + current.width - overlap
    }, 0)
  }
  get anchorNext(): Vector2 {
    return [this.anchorTail[0] + this.width, this.anchorTail[1]]
  }
  appendToTail(snake: Snake) {
    this.anchorTail[0] -= snake.width - overlap
    this.blocks = snake.blocks.concat(this.blocks)
  }
  appendToHead(snake: Snake) {
    this.blocks = this.blocks.concat(snake.blocks)
  }
}
