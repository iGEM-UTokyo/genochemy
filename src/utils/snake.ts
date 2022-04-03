import { BlockWithUUID, Vector2 } from "./block";
import { v4 as uuidv4 } from 'uuid'

export const overlap = 9
export const splitMovement = 5
export class Snake {
  uuid: string
  blocks: BlockWithUUID[]
  anchorTail: Vector2
  fromTray: boolean
  constructor(args:
    Pick<Snake, 'uuid' | 'blocks' | 'anchorTail'> &
    Partial<Pick<Snake, 'fromTray'>>) {
    this.uuid = args.uuid
    this.blocks = args.blocks
    this.anchorTail = args.anchorTail
    this.fromTray = args.fromTray || false
  }
  static copy(snake: Snake) {
    return new Snake({
      uuid: snake.uuid,
      blocks: snake.blocks.slice(0),
      anchorTail: [snake.anchorTail[0], snake.anchorTail[1]],
      fromTray: snake.fromTray
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
  splitHead(blockUUID: string) {
    let anchorX = this.anchorTail[0]
    for (const [index, block] of this.blocks.entries()) {
      anchorX += block.width - overlap
      if (block.uuid === blockUUID) {
        if (index === this.blocks.length - 1) return
        const newSnake = new Snake({
          uuid: uuidv4(),
          blocks: this.blocks.splice(index + 1),
          anchorTail: [anchorX, this.anchorTail[1]]
        })
        console.log(this.blocks)
        return newSnake
      }
    }
  }
  splitTail(blockUUID: string) {
    let anchorX = this.anchorTail[0]
    for (const [index, block] of this.blocks.entries()) {
      if (block.uuid === blockUUID) {
        if (index === 0) return
        const newSnake = new Snake({
          uuid: uuidv4(),
          blocks: this.blocks.splice(0, index),
          anchorTail: this.anchorTail
        })
        this.anchorTail = [anchorX, this.anchorTail[1]]
        return newSnake
      }
      anchorX += block.width - overlap
    }
  }
}
