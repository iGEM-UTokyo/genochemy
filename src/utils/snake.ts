import { BlockWithUUID, Vector2, WrapHeadBlock, WrapTailBlock } from "./block";
import { v4 as uuidv4 } from "uuid";
import { DeepReadonly } from "@/utils/deep-readonly";

export const overlap = 9;
export const splitMovement = 5;
export class Snake {
  uuid: string;
  blocks: BlockWithUUID[];
  anchorTail: Vector2;
  fromTray: boolean;
  visible: boolean;
  grabbingBlockUUID: string | null;
  constructor(
    args: Pick<Snake, "uuid" | "blocks" | "anchorTail"> &
      Partial<Pick<Snake, "fromTray" | "visible" | "grabbingBlockUUID">>
  ) {
    this.uuid = args.uuid;
    this.blocks = args.blocks;
    this.anchorTail = args.anchorTail;
    this.fromTray = args.fromTray ?? false;
    this.visible = args.visible ?? true;
    this.grabbingBlockUUID = args.grabbingBlockUUID ?? null;
  }
  static copy(snake: DeepReadonly<Snake>) {
    return new Snake({
      uuid: snake.uuid,
      blocks: snake.blocks.slice(0),
      anchorTail: [snake.anchorTail[0], snake.anchorTail[1]],
      fromTray: snake.fromTray,
      grabbingBlockUUID: snake.grabbingBlockUUID,
    });
  }
  get width() {
    return this.blocks.reduce((prev, current) => {
      if (prev === 0) {
        return prev + current.design.width;
      }
      // consider overlaps
      return prev + current.design.width - overlap;
    }, 0);
  }
  get height() {
    let upLimit = 0;
    let downLimit = 0;
    for (const block of this.blocks) {
      upLimit = Math.max(
        block.design.height - block.design.bottomAnchor,
        upLimit
      );
      downLimit = Math.max(block.design.bottomAnchor, downLimit);
    }
    return upLimit + downLimit;
  }
  get bottomAnchor() {
    return this.blocks.reduce(
      (prev, block) => Math.max(prev, block.design.bottomAnchor),
      0
    );
  }
  get anchorNext(): Vector2 {
    return [this.anchorTail[0] + this.width, this.anchorTail[1]];
  }
  appendToTail(snake: Snake) {
    this.anchorTail[0] -= snake.width - overlap;
    this.blocks = snake.blocks.concat(this.blocks);
  }
  appendToHead(snake: Snake) {
    this.blocks = this.blocks.concat(snake.blocks);
  }
  splitHead(blockUUID: string) {
    let anchorX = this.anchorTail[0];
    for (const [index, block] of this.blocks.entries()) {
      anchorX += block.design.width - overlap;
      if (block.uuid === blockUUID) {
        if (index === this.blocks.length - 1) return;
        const newSnake = new Snake({
          uuid: uuidv4(),
          blocks: this.blocks.splice(index + 1),
          anchorTail: [anchorX, this.anchorTail[1]],
        });
        return newSnake;
      }
    }
  }
  splitTail(blockUUID: string) {
    let anchorX = this.anchorTail[0];
    for (const [index, block] of this.blocks.entries()) {
      if (block.uuid === blockUUID) {
        if (index === 0) return;
        const newSnake = new Snake({
          uuid: uuidv4(),
          blocks: this.blocks.splice(0, index),
          anchorTail: this.anchorTail,
        });
        this.anchorTail = [anchorX, this.anchorTail[1]];
        return newSnake;
      }
      anchorX += block.design.width - overlap;
    }
  }
  wrap(border: { before: string }) {
    const head = this.splitHead(border.before);
    if (!head) return;
    head.anchorTail[0] += 20;
    head.anchorTail[1] += 30;
    this.blocks.push(new WrapTailBlock(head.uuid));
    head.blocks = [new WrapHeadBlock(this.uuid), ...head.blocks];
    return head;
  }
  get isHeadCovered() {
    return this.blocks[this.blocks.length - 1] instanceof WrapTailBlock;
  }
  get isTailCovered() {
    return this.blocks[0] instanceof WrapHeadBlock;
  }
  getBlockBoundary(blockUUID: string): { tailX: number; headX: number } | null {
    let tailX = this.anchorTail[0];
    let headX = this.anchorTail[0];
    let foundFlag = false;
    for (const block of this.blocks) {
      headX += block.design.width - overlap;
      if ((block.uuid = blockUUID)) {
        foundFlag = true;
        break;
      }
      tailX += block.design.width - overlap;
    }
    if (!foundFlag) return null;
    return { tailX, headX };
  }
}
