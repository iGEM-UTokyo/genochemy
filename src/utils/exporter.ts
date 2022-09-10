import { DeepReadonly } from "vue";
import { JsonFormat } from "./importer";
import { Snake } from "./snake";

export default function exportJson(snakes: DeepReadonly<Snake>[]): JsonFormat {
  return snakes.map((snake) => ({
    blocks: snake.blocks.map((block) => block.uniqueName),
    // anchor: snake.anchorTail,
  }));
}
