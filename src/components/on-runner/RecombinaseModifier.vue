<template>
  <div></div>
</template>

<script lang="ts">
export default {
  name: "RecombinaseModifier",
  customOptions: {},
};
</script>

<script setup lang="ts">
import { onUnmounted, toRefs, watch } from "vue";
import { useStore } from "@/store";
import { RecombinaseRecognitionSeqBlock } from "@/utils/block";

const store = useStore();
const {
  runnerOutputs,
  registerOutput,
  UnregisterOutput,
  cutSnake,
  recombineTwoSnakes,
  updateRunner,
} = store;

const recombinases = [
  {
    name: "protein-RecombinaseI",
    matterName: "sequence.recogRecombA.name",
  },
  {
    name: "protein-RecombinaseII",
    matterName: "sequence.recogRecombB.name",
  },
] as const;

const { isRunning, snakes, currentRunner } = toRefs(store);
watch(currentRunner, () => {
  prevOutputs = {};
  for (const recombinase of recombinases) {
    prevOutputs[recombinase.name] = 0;
    convergeCount[recombinase.name] = 0;
  }
});

for (const recombinase of recombinases) {
  registerOutput(recombinase.name);
}
onUnmounted(() => {
  for (const recombinase of recombinases) {
    UnregisterOutput(recombinase.name);
  }
});

let requestAnimationFrameId: number | null = null;
let convergeCount: Record<string, number> = {};
let prevOutputs: Record<string, number> = {};
function tick() {
  requestAnimationFrameId = null;
  if (!isRunning.value) return;
  for (const recombinase of recombinases) {
    const p1 = 1 - Math.exp(-runnerOutputs[recombinase.name] * 0.005);
    const p2 = 1 - Math.exp(-runnerOutputs[recombinase.name] * 0.01);
    if (p2 > 0.001) {
      const rand = Math.random();
      if (rand <= p1) {
        const recogSeqUUIDs: {
          snakeUUID: string;
          index: number;
        }[] = [];
        for (const snake of Object.values(snakes.value)) {
          if (snake.isLoop) continue;
          for (let i = 0; i < snake.blocks.length; i++) {
            const block = snake.blocks[i];
            if (
              block instanceof RecombinaseRecognitionSeqBlock &&
              block.params.recombinase.value === recombinase.matterName
            ) {
              recogSeqUUIDs.push({
                snakeUUID: snake.uuid,
                index: i,
              });
            }
          }
        }
        if (recogSeqUUIDs.length >= 2) {
          const firstRecogSeq = recogSeqUUIDs.splice(
            Math.floor(Math.random() * recogSeqUUIDs.length),
            1
          )[0];
          const secondRecogSeq = recogSeqUUIDs.splice(
            Math.floor(Math.random() * recogSeqUUIDs.length),
            1
          )[0];
          if (firstRecogSeq.snakeUUID === secondRecogSeq.snakeUUID) {
            cutSnake(
              firstRecogSeq.snakeUUID,
              Math.min(firstRecogSeq.index, secondRecogSeq.index),
              Math.max(firstRecogSeq.index, secondRecogSeq.index)
            );
          } else {
            recombineTwoSnakes(
              firstRecogSeq.snakeUUID,
              secondRecogSeq.snakeUUID,
              firstRecogSeq.index,
              secondRecogSeq.index
            );
          }
          updateRunner();
        }
      } else if (rand <= p2 || convergeCount[recombinase.name] === 50) {
        const recogSeqUUIDs: { [snakeUUID: string]: number[] } = {};
        for (const snake of Object.values(snakes.value)) {
          if (snake.isLoop) continue;
          for (let i = 0; i < snake.blocks.length; i++) {
            const block = snake.blocks[i];
            if (
              block instanceof RecombinaseRecognitionSeqBlock &&
              block.params.recombinase.value === recombinase.matterName
            ) {
              if (!recogSeqUUIDs[snake.uuid]) {
                recogSeqUUIDs[snake.uuid] = [];
              }
              recogSeqUUIDs[snake.uuid].push(i);
            }
          }
          if (
            recogSeqUUIDs[snake.uuid] &&
            recogSeqUUIDs[snake.uuid].length < 2
          ) {
            delete recogSeqUUIDs[snake.uuid];
          }
        }
        const snakeUUIDs = Object.keys(recogSeqUUIDs);
        if (snakeUUIDs.length !== 0) {
          const targetSnakeUUID =
            snakeUUIDs[Math.floor(Math.random() * snakeUUIDs.length)];
          const targetSnakeIndices = recogSeqUUIDs[targetSnakeUUID];
          const firstRecogSeq = targetSnakeIndices.splice(
            Math.floor(Math.random() * targetSnakeIndices.length),
            1
          )[0];
          const secondRecogSeq = targetSnakeIndices.splice(
            Math.floor(Math.random() * targetSnakeIndices.length),
            1
          )[0];
          cutSnake(
            targetSnakeUUID,
            Math.min(firstRecogSeq, secondRecogSeq),
            Math.max(firstRecogSeq, secondRecogSeq)
          );
          updateRunner();
        }
      }
      if (
        Math.abs(
          runnerOutputs[recombinase.name] - prevOutputs[recombinase.name]
        ) <= 0.0001
      ) {
        convergeCount[recombinase.name]++;
      }
    }
    prevOutputs[recombinase.name] = runnerOutputs[recombinase.name];
  }
  requestAnimationFrameId = requestAnimationFrame(tick);
}

watch(isRunning, () => {
  if (isRunning.value && requestAnimationFrameId === null) {
    tick();
  }
});
if (isRunning.value && requestAnimationFrameId === null) {
  tick();
}
</script>
