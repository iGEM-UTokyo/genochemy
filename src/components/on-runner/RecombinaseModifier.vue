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
import { RecombinaseARecognitionSeqBlock } from "@/utils/block";

const store = useStore();
const {
  runnerOutputs,
  registerOutput,
  UnregisterOutput,
  cutSnake,
  updateRunner,
} = store;
const { isRunning, snakes } = toRefs(store);

registerOutput("protein-RecombinaseA");
onUnmounted(() => {
  UnregisterOutput("protein-RecombinaseA");
});

let requestAnimationFrameId: number | null = null;
function tick() {
  requestAnimationFrameId = null;
  if (!isRunning.value) return;
  const p = 1 - Math.exp(-runnerOutputs["protein-RecombinaseA"] * 0.1); // * 0.001);
  if (Math.random() <= p) {
    console.log("recombine!");
    const recogSeqUUIDs: {
      snakeUUID: string;
      blockUUID: string;
      index: number;
    }[] = [];
    for (const snake of Object.values(snakes.value)) {
      for (let i = 0; i < snake.blocks.length; i++) {
        if (snake.blocks[i] instanceof RecombinaseARecognitionSeqBlock) {
          recogSeqUUIDs.push({
            snakeUUID: snake.uuid,
            blockUUID: snake.blocks[i].uuid,
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
        updateRunner();
      }
    }
  }
  requestAnimationFrameId = requestAnimationFrame(tick);
}

watch(isRunning, () => {
  if (isRunning.value && requestAnimationFrameId === null) {
    tick();
  }
});
</script>
