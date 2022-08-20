<template>
  <div class="snake" ref="snakeRef" :style="style">
    <svg>
      <Block :key="block.uuid" :x="0" :y="0" :block="block" anchor-top-left />
    </svg>
    <!-- v-for="block in props.snake.blocks" -->
  </div>
</template>

<script setup lang="ts">
import { Snake } from "@/utils/snake";
import { useStore } from "../store";
import Block from "@/components/Block.vue";
import {
  Ref,
  ref,
  defineProps,
  computed,
  StyleValue,
  ComputedRef,
  watch,
  inject,
} from "vue";
import { Vector2 } from "@/utils/block";
import { DeepReadonly } from "@/utils/deep-readonly";
import {
  getAbsolutePositionKey,
  getFixedPositionKey,
  willBeDeletedKey,
} from "./Program.vue";

const props = defineProps<{
  snake: DeepReadonly<Snake>;
}>();

const block = computed(() => props.snake.blocks[0]);

const getFixedPosition = inject(getFixedPositionKey);
const getAbsolutePosition = inject(getAbsolutePositionKey);
const willBeDeleted = inject(willBeDeletedKey);

const isActiveDeleteZone = ref(false);

let currentSnake = ref(Snake.copy(props.snake));
// props.snake: not working
watch(
  props,
  () => {
    currentSnake.value = Snake.copy(props.snake);
  },
  { flush: "post" }
);
const snakeRef: Ref<HTMLElement | null> = ref(null);
const { addSnake, snakes, mergeToTail, mergeToHead, clearTempBlock } =
  useStore();
// non-reactive. updated on mousedown
let tailAnchors: { pos: Readonly<Vector2>; uuid: string }[] = [];
// non-reactive. updated on mousedown
let headAnchors: { pos: Readonly<Vector2>; uuid: string }[] = [];
const isGrabbing = ref(false);
const down = () => {
  window.addEventListener("mousemove", mousemove);
  window.addEventListener("mouseup", mouseup);
  window.addEventListener("touchmove", touchmove);
  window.addEventListener("touchend", touchend);
  tailAnchors = [];
  headAnchors = [];
  isGrabbing.value = true;
  for (let snake of Object.values(snakes)) {
    tailAnchors.push({ pos: snake.anchorTail, uuid: snake.uuid });
    headAnchors.push({ pos: snake.anchorNext, uuid: snake.uuid });
  }
};

const anchorTail = computed(() => currentSnake.value.anchorTail);
const style: ComputedRef<StyleValue> = computed(() => {
  const absolutePosition: Vector2 = [
    anchorTail.value[0],
    anchorTail.value[1] - (snakeRef.value ? snakeRef.value.clientHeight : 0),
  ];
  if (isGrabbing.value) {
    if (!getFixedPosition) {
      throw new Error("Injected getFixedPosition is undefined.");
    }
    const fixedPosition = getFixedPosition(absolutePosition);
    return {
      position: "fixed",
      top: `${fixedPosition[1]}px`,
      left: `${fixedPosition[0]}px`,
    };
  }
  return {
    position: "absolute",
    top: `${absolutePosition[1]}px`,
    left: `${absolutePosition[0]}px`,
  };
});

const currentBindInfo: Ref<{
  bindGuide: [Readonly<Vector2>, Readonly<Vector2>];
  toUUID: string;
  mode: "head" | "tail";
} | null> = ref(null);
const mousemove = (event: MouseEvent) => {
  move(event.movementX, event.movementY, event.shiftKey);
};
let previousTouch: Touch | null = null;
const touchmove = (event: TouchEvent) => {
  event.preventDefault();
  if (previousTouch) {
    move(
      event.touches[0].clientX - previousTouch.clientX,
      event.touches[0].clientY - previousTouch.clientY,
      event.shiftKey
    );
  }
  previousTouch = event.touches[0];
  return false;
};
const move = (movementX: number, movementY: number, shiftKey = false) => {
  currentSnake.value.anchorTail[0] += movementX;
  currentSnake.value.anchorTail[1] += movementY;
  let hasSet = false;
  const _head = currentSnake.value.anchorNext;
  for (let tailAnchor of tailAnchors) {
    if (tailAnchor.uuid === currentSnake.value.uuid) continue;
    const distance =
      (tailAnchor.pos[0] - _head[0]) ** 2 + (tailAnchor.pos[1] - _head[1]) ** 2;
    if (distance <= 50 ** 2) {
      currentBindInfo.value = {
        bindGuide: [tailAnchor.pos, _head],
        toUUID: tailAnchor.uuid,
        mode: "tail",
      };
      hasSet = true;
    }
  }
  const _tail: Vector2 = anchorTail.value;
  for (let headAnchor of headAnchors) {
    if (headAnchor.uuid === currentSnake.value.uuid) continue;
    const distance =
      (headAnchor.pos[0] - _tail[0]) ** 2 + (headAnchor.pos[1] - _tail[1]) ** 2;
    if (distance <= 50 ** 2) {
      currentBindInfo.value = {
        bindGuide: [headAnchor.pos, _tail],
        toUUID: headAnchor.uuid,
        mode: "head",
      };
      hasSet = true;
    }
  }
  if (!hasSet) {
    currentBindInfo.value = null;
  }
  if (!willBeDeleted || !getFixedPosition) {
    throw new Error("Injected willBeDeleted or getFixedPosition is undefined.");
  }
  isActiveDeleteZone.value =
    !currentSnake.value.fromTray && willBeDeleted(getFixedPosition(_tail));
};
const mouseup = () => {
  up();
};
const touchend = () => {
  up();
};
const up = () => {
  window.removeEventListener("mousemove", mousemove);
  window.removeEventListener("mouseup", mouseup);
  window.removeEventListener("touchmove", touchmove);
  window.removeEventListener("touchend", touchend);
  isGrabbing.value = false;
  previousTouch = null;

  if (
    willBeDeleted &&
    getFixedPosition &&
    willBeDeleted(getFixedPosition(currentSnake.value.anchorTail))
  ) {
    clearTempBlock();
    return;
  }
  if (currentBindInfo.value !== null) {
    if (currentBindInfo.value.mode === "head") {
      mergeToHead(currentSnake.value.uuid, currentBindInfo.value.toUUID);
    } else {
      mergeToTail(currentSnake.value.uuid, currentBindInfo.value.toUUID);
    }
    currentBindInfo.value = null;
  } else {
    const newSnake = Snake.copy(currentSnake.value);
    newSnake.fromTray = false;
    addSnake(newSnake);
  }
  clearTempBlock();
};

if (!getAbsolutePosition) {
  throw new Error("Injected getAbsolutePosition is undefined.");
}
currentSnake.value.anchorTail = getAbsolutePosition(
  currentSnake.value.anchorTail
);
down();
</script>

<style scoped>
.snake {
  position: absolute;
  display: flex;
  align-items: flex-end;
  z-index: 99;
  touch-action: none;
  transform: translateY(50%);
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
