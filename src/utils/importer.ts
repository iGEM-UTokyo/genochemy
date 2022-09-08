import { Block, BlockWithUUID, uniqueNameToBlock, Vector2 } from "./block";
import { Snake } from "./snake";
import { v4 as uuidv4 } from "uuid";

// todo: define schema
export type JsonFormat = { blocks: string[]; anchor?: Vector2 }[];

function setUUID(block: Block): asserts block is BlockWithUUID {
  block.uuid = uuidv4();
}

export default function importJson(json: JsonFormat): Snake[] {
  const snakes: Snake[] = [];
  let accumulatedHeight = 0;
  for (const snake of json) {
    const blocks = snake.blocks.map((uniqueName): BlockWithUUID => {
      const block = uniqueNameToBlock(uniqueName);
      setUUID(block);
      return block;
    });
    const newSnake = new Snake({
      uuid: uuidv4(),
      blocks,
      anchorTail: [0, 0],
    });
    newSnake.anchorTail[1] = accumulatedHeight + newSnake.upLimit;
    snakes.push(newSnake);
    accumulatedHeight += newSnake.height + 10;
  }
  return snakes;
}
