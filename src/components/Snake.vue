<template>
  <div class="snake" ref="snakeRef" :style="style">
    <Block
      v-for="block in props.snake.blocks"
      @mousedown="down(block.uuid)"
      @touchstart="down(block.uuid)"
      @dblclick="doubleclick(block.uuid)"
      :key="block.uuid"
      :block="block"
    />
    <teleport to=".program">
      <BindGuide
        v-if="currentBindInfo !== null"
        :positions="currentBindInfo.bindGuide"
      />
    </teleport>
    <teleport to=".tray">
      <transition name="delete-zone-transition" :appear="true">
        <div
          :class="{ 'delete-zone': true, active: isActiveDeleteZone }"
          v-if="showDeleteZone"
        >
          <font-awesome-icon icon="trash" />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { Snake } from "@/utils/snake";
import { useStore } from "../store";
import Block from "@/components/Block.vue";
import BindGuide from "@/components/BindGuide.vue";
import {
  Ref,
  ref,
  reactive,
  defineProps,
  computed,
  StyleValue,
  ComputedRef,
  toRaw,
  watch,
  inject,
} from "vue";
import { BlockWithUUID, Vector2 } from "@/utils/block";
import { DeepReadonly } from "@/utils/deep-readonly";
import {
  getAbsolutePositionKey,
  getFixedPositionKey,
  willBeDeletedKey,
} from "./Program.vue";

const props = defineProps<{
  snake: DeepReadonly<Snake>;
}>();

const getFixedPosition = inject(getFixedPositionKey);
const getAbsolutePosition = inject(getAbsolutePositionKey);
const willBeDeleted = inject(willBeDeletedKey);

const isActiveDeleteZone = ref(false);
const showDeleteZone = computed(
  () => !currentSnake.value.fromTray && grabbingBlockUUID.value
);

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
const {
  updateSnake,
  snakes,
  mergeToTail,
  mergeToHead,
  splitHead,
  splitTail,
  deleteSnake,
} = useStore();
// non-reactive. updated on mousedown
let tailAnchors: { pos: Readonly<Vector2>; uuid: string }[] = [];
// non-reactive. updated on mousedown
let headAnchors: { pos: Readonly<Vector2>; uuid: string }[] = [];
const grabbingBlockUUID: Ref<string | null> = ref(null);
let hasSplitted = false;
const down = (blockUUID: string) => {
  window.addEventListener("mousemove", mousemove);
  window.addEventListener("touchmove", touchmove);
  window.addEventListener("mouseup", up);
  window.addEventListener("touchend", up);
  tailAnchors = [];
  headAnchors = [];
  grabbingBlockUUID.value = blockUUID;
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
  if (grabbingBlockUUID.value) {
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
  if (!hasSplitted && grabbingBlockUUID.value !== null && shiftKey) {
    if (movementX < 0) {
      hasSplitted = true;
      // updateSnake is needed to update the current position of the snake before splitting.
      updateSnake(Snake.copy(currentSnake.value));
      splitHead(currentSnake.value.uuid, grabbingBlockUUID.value);
    } else if (movementX > 0) {
      hasSplitted = true;
      updateSnake(Snake.copy(currentSnake.value));
      splitTail(currentSnake.value.uuid, grabbingBlockUUID.value);
    }
  }
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
const up = () => {
  window.removeEventListener("mousemove", mousemove);
  window.removeEventListener("touchmove", touchmove);
  window.removeEventListener("mouseup", up);
  window.removeEventListener("touchend", up);
  grabbingBlockUUID.value = null;
  hasSplitted = false;
  previousTouch = null;

  if (
    willBeDeleted &&
    getFixedPosition &&
    willBeDeleted(getFixedPosition(currentSnake.value.anchorTail))
  ) {
    deleteSnake(currentSnake.value.uuid);
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
    updateSnake(newSnake);
  }
};

const doubleclick = (blockUUID: string) => {
  splitTail(currentSnake.value.uuid, blockUUID, true);
  splitHead(currentSnake.value.uuid, blockUUID, true);
};

if (currentSnake.value.fromTray) {
  if (!getAbsolutePosition) {
    throw new Error("Injected getAbsolutePosition is undefined.");
  }
  currentSnake.value.anchorTail = getAbsolutePosition(
    currentSnake.value.anchorTail
  );
  down(currentSnake.value.blocks[0].uuid);
}
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
