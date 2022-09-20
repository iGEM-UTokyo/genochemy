import {
  Block,
  BlockWithUUID,
  uniqueNameToBlockV1,
  uniqueNameToBlockV2,
  Vector2,
} from "./block";
import { Snake } from "./snake";
import { v4 as uuidv4 } from "uuid";
import { MessagesAddresses } from "@/messages";

// todo: define schema
export type JsonFormatV1 = { blocks: string[]; anchor?: Vector2 }[];
export type JsonFormatV2 = {
  b: {
    // blocks
    un: MessagesAddresses; // uniqueName
    p?: Record<string, string>; // parameters
  }[];
  a?: Vector2; // anchor
}[];

function setUUID(block: Block): asserts block is BlockWithUUID {
  block.uuid = uuidv4();
}

export function importJsonV1(json: JsonFormatV1): Snake[] {
  const snakes: Snake[] = [];
  let accumulatedHeight = 20;
  for (const snake of json) {
    const blocks = snake.blocks.map((uniqueName): BlockWithUUID => {
      const block = uniqueNameToBlockV1(uniqueName);
      setUUID(block);
      return block;
    });
    const newSnake = new Snake({
      uuid: uuidv4(),
      blocks,
      anchorTail: [20, 0],
    });
    newSnake.anchorTail[1] = accumulatedHeight + newSnake.upLimit;
    snakes.push(newSnake);
    accumulatedHeight += newSnake.height + 10;
  }
  return snakes;
}

export function importJsonV2(json: JsonFormatV2): Snake[] {
  const snakes: Snake[] = [];
  let accumulatedHeight = 20;
  for (const snake of json) {
    const blocks = snake.b.map((_block): BlockWithUUID => {
      const block = uniqueNameToBlockV2(_block.un);
      if (block.params && _block.p) {
        for (const key of Object.keys(_block.p)) {
          block.params[key].value = _block.p[key];
        }
      }
      setUUID(block);
      return block;
    });
    const newSnake = new Snake({
      uuid: uuidv4(),
      blocks,
      anchorTail: [20, 0],
    });
    newSnake.anchorTail[1] = accumulatedHeight + newSnake.upLimit;
    snakes.push(newSnake);
    accumulatedHeight += newSnake.height + 10;
  }
  return snakes;
}

export default function importJson(
  json: JsonFormatV1 | JsonFormatV2,
  version: number
): Snake[] {
  switch (version) {
    case 1:
      return importJsonV1(json as JsonFormatV1);
    case 2:
      return importJsonV2(json as JsonFormatV2);
    default:
      throw new Error("Invalid version");
  }
}
