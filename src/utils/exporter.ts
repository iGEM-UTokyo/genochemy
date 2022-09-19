import { DeepReadonly } from "vue";
import { JsonFormatV2 } from "./importer";
import { Snake } from "./snake";

export default function exportJsonV2(
  snakes: DeepReadonly<Snake>[]
): JsonFormatV2 {
  return snakes.map((snake) => ({
    b: snake.blocks.map((block) => {
      if (block.uniqueName === "") {
        throw new Error("You cannot export this block");
      }
      return {
        un: block.uniqueName,
        ...(block.params !== null
          ? {
              p: Object.fromEntries(
                Object.entries(block.params).map(([key, { value }]) => [
                  key,
                  value,
                ])
              ),
            }
          : {}),
      };
    }),
    // anchor: snake.anchorTail,
  }));
}
