<template>
  <g>
    <g :transform="`translate(${x}, ${y})`" @click="click">
      <Block
        v-for="[x, block] in blockWithPosition"
        @mousedown="mousedown(block.uuid)"
        @touchstart="mousedown(block.uuid)"
        @mousemove="mousemove(block.uuid)"
        :key="block.uuid"
        :block="block"
        :x="x"
        :y="0"
      />
    </g>
    <teleport to=".program-inner-back">
      <WrapConnector v-if="wrapInfo !== null" :positions="wrapInfo" />
    </teleport>
  </g>
</template>

<script setup lang="ts">
import { overlap, Snake } from "@/utils/snake";
import { useStore } from "../store";
import Block from "@/components/Block.vue";
import { ref, defineProps, computed, watch, inject } from "vue";
import { BlockWithUUID, Vector2, WrapTailBlock } from "@/utils/block";
import { DeepReadonly } from "@/utils/deep-readonly";
import { getAbsolutePositionKey } from "./Program.vue";
import { CursorMode } from "./CursorMode.vue";
import WrapConnector from "./WrapConnector.vue";

const props = defineProps<{
  snake: DeepReadonly<Snake>;
  cursorMode: CursorMode;
}>();

const blockWithPosition = computed<[number, BlockWithUUID][]>(() => {
  let accumulatedX = 0;
  return props.snake.blocks.map((block) => {
    const result: [number, BlockWithUUID] = [accumulatedX, block];
    accumulatedX += block.design.width - overlap;
    return result;
  });
});

const getAbsolutePosition = inject(getAbsolutePositionKey);

let currentSnake = ref(Snake.copy(props.snake));
// props.snake: not working
watch(
  props,
  () => {
    currentSnake.value = Snake.copy(props.snake);
  },
  { flush: "post" }
);

const { splitHead, splitTail, wrapSnake, setGrabbing, snakes } = useStore();
const wrapInfo = computed<DeepReadonly<[Vector2, Vector2]> | null>(() => {
  const head = currentSnake.value.blocks[currentSnake.value.blocks.length - 1];
  if (head instanceof WrapTailBlock) {
    if (snakes[head.connectTo]) {
      return [currentSnake.value.anchorNext, snakes[head.connectTo].anchorTail];
    }
  }
  return null;
});
let touchingBlockUUID: string | null = null;
let timeoutId: number | null = null;
const mousedown = (blockUUID: string) => {
  if (touchingBlockUUID !== null) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    touchingBlockUUID = null;
    doubleclick(blockUUID);
  } else {
    touchingBlockUUID = blockUUID;
    timeoutId = setTimeout(() => {
      touchingBlockUUID = null;
      down(blockUUID);
    }, 350);
  }
};
const mousemove = (blockUUID: string) => {
  if (touchingBlockUUID !== null) {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    touchingBlockUUID = null;
    down(blockUUID);
  }
};
const down = (blockUUID: string) => {
  // blockUUID was used for splitting.
  if (props.cursorMode === "move") {
    setGrabbing(currentSnake.value.uuid);
  }
};

const anchorTail = computed(() => currentSnake.value.anchorTail);
const x = computed(() => anchorTail.value[0]);
const y = computed(() => anchorTail.value[1]);

const doubleclick = (blockUUID: string) => {
  splitTail(currentSnake.value.uuid, blockUUID, true);
  splitHead(currentSnake.value.uuid, blockUUID, true);
};

const click = (event: MouseEvent) => {
  if (props.cursorMode === "wrap") {
    if (!getAbsolutePosition) {
      throw new Error("Injected getAbsolutePosition is undefined.");
    }
    const x =
      getAbsolutePosition([event.pageX, event.pageY])[0] -
      props.snake.anchorTail[0];
    let closestBlock: BlockWithUUID | null = null;
    let accumulatedWidth = 0;
    let beforeDistance = x - 0;
    for (const block of Object.values(props.snake.blocks)) {
      accumulatedWidth += block.design.width - overlap;
      const newDistance = Math.abs(x - accumulatedWidth);
      if (beforeDistance < newDistance) {
        break;
      }
      beforeDistance = newDistance;
      closestBlock = block;
    }
    if (
      closestBlock?.uuid ===
      props.snake.blocks[props.snake.blocks.length - 1].uuid
    ) {
      closestBlock === null;
    }
    if (closestBlock) {
      wrapSnake(currentSnake.value.uuid, { before: closestBlock.uuid });
    }
  }
};
</script>

<style scoped>
.snake {
  position: absolute;
  display: flex;
  align-items: flex-end;
  z-index: 99;
  touch-action: none;
}
.delete-zone {
  transition: all 0.3s;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #aaaaaa55;
  font-size: 30px;
}
.delete-zone.active {
  background-color: #d5000055;
}
.delete-zone-transition-enter-from,
.delete-zone-transition-leave-to {
  opacity: 0;
}
.delete-zone-transition-enter-to,
.delete-zone-transition-leave-from {
  opacity: 1;
}
</style>
