<template>
  <div class="program" ref="programRef" @wheel="wheel">
    <svg style="width: 100%; height: 100%">
      <g class="program-inner" :transform="`translate(${-scrollX})`">
        <g class="program-inner-back" />
        <SnakeVue
          v-for="snake in filteredSnakes"
          :key="snake.uuid"
          :snake="snake"
          :cursor-mode="cursorMode"
        />
      </g>
      <ScrollBar
        :viewportWidth="programWidth"
        :viewportHeight="programHeight"
        :min-x="limits[0][0]"
        :max-x="limits[1][0]"
        v-model="scrollX"
      />
    </svg>
    <DraggingSnake v-if="draggingSnake !== null" v-model="draggingSnake" />
    <CursorMode v-model="cursorMode" />
    <div class="running" v-if="isRunning" />
  </div>
</template>

<script lang="ts">
import {
  InjectionKey,
  provide,
  Ref,
  ref,
  computed,
  toRefs,
  watch,
  DeepReadonly,
} from "vue";
import { useStore } from "../store";
import DraggingSnake from "@/components/DraggingSnake.vue";
import { Vector2 } from "@/utils/block";
import ScrollBar from "@/components/ScrollBar.vue";
import { Snake } from "@/utils/snake";
import SnakeVue from "@/components/Snake.vue";

export const getFixedPositionKey: InjectionKey<
  (absolutePos: DeepReadonly<Vector2>) => Vector2
> = Symbol("getFixedPosition");
export const getAbsolutePositionKey: InjectionKey<
  (fixedPos: DeepReadonly<Vector2>) => Vector2
> = Symbol("getAbsolutePosition");
export const willBeDeletedKey: InjectionKey<(fixedPos: Vector2) => boolean> =
  Symbol("wellBeDeleted");
</script>

<script setup lang="ts">
import CursorMode, {
  CursorMode as CursorModeType,
} from "@/components/CursorMode.vue";

const { snakes, draggingSnake: _draggingSnake, isRunning } = toRefs(useStore());
const draggingSnake = ref<Snake | null>(null);
watch(_draggingSnake, () => {
  if (_draggingSnake.value !== null) {
    draggingSnake.value = Snake.copy(_draggingSnake.value);
  } else {
    draggingSnake.value = null;
  }
});

const filteredSnakes = computed(() =>
  Object.values(snakes.value).filter((snake) => snake.visible)
);

const programRef: Ref<HTMLElement | null> = ref(null);

const programWidth = ref(0);
const programHeight = ref(0);

watch(programRef, (_, prevProgramRef) => {
  if (!prevProgramRef && programRef.value) {
    ro.observe(programRef.value);
  }
  if (programRef.value) {
    programWidth.value = programRef.value.clientWidth;
    programHeight.value = programRef.value.clientHeight;
  }
});

const ro = new ResizeObserver(() => {
  if (programRef.value) {
    programWidth.value = programRef.value.clientWidth;
    programHeight.value = programRef.value.clientHeight;
  }
});

const scrollX = ref(0);

const limits = computed(() => {
  return [
    ...Object.values(snakes.value).flatMap<
      DeepReadonly<{ tail: Vector2; head: Vector2 }>
    >((snake) =>
      snake.visible ? { tail: snake.anchorTail, head: snake.anchorNext } : []
    ),
    ...(draggingSnake.value
      ? [
          {
            tail: draggingSnake.value.anchorTail,
            head: draggingSnake.value.anchorNext,
          },
        ]
      : []),
  ].reduce(
    (a, b) => [
      [Math.min(a[0][0], b.tail[0] - 20), Math.min(a[0][1], b.tail[1] - 20)],
      [Math.max(a[1][0], b.head[0] + 20), Math.max(a[1][1], b.head[1] + 20)],
    ],
    [
      [Math.min(0, scrollX.value), 0],
      [Math.max(0, scrollX.value) + programWidth.value, programHeight.value],
    ]
  );
});

function normalizeScrollX(newScrollX: number) {
  return Math.min(
    Math.max(newScrollX, limits.value[0][0]),
    limits.value[1][0] - (programRef.value?.clientWidth ?? 0)
  );
}

watch(limits, () => {
  scrollX.value = normalizeScrollX(scrollX.value);
});

const scrollRate = 0.1;
let requestAnimationFrameId: number | null = null;
function checkBorder() {
  requestAnimationFrameId = null;
  if (!programRef.value) return;
  if (!draggingSnake.value || !draggingSnake.value.grabbingBlockUUID) return;
  const blockBoundary = draggingSnake.value.getBlockBoundary(
    draggingSnake.value.grabbingBlockUUID
  );
  if (!blockBoundary) return;
  const positiveX =
    blockBoundary.headX - (scrollX.value + programRef.value.clientWidth + 5);
  const negativeX = scrollX.value - 5 - blockBoundary.tailX;
  if (positiveX > 0) {
    scrollX.value += positiveX * scrollRate;
    draggingSnake.value.anchorTail[0] += positiveX * scrollRate;
  } else if (negativeX > 0) {
    scrollX.value -= negativeX * scrollRate;
    draggingSnake.value.anchorTail[0] -= negativeX * scrollRate;
  }
  requestAnimationFrameId = requestAnimationFrame(checkBorder);
}
watch(draggingSnake, () => {
  if (requestAnimationFrameId === null && draggingSnake.value !== null) {
    checkBorder();
  }
});

const cursorMode = ref<CursorModeType>("move");

function getFixedPosition(absolutePos: Vector2) {
  if (programRef.value === null) {
    throw new Error("programRef is null.");
  }
  const boundingRect = programRef.value.getBoundingClientRect();
  return [
    absolutePos[0] + boundingRect.x - scrollX.value,
    absolutePos[1] + boundingRect.y,
  ];
}
provide(getFixedPositionKey, getFixedPosition);

function getAbsolutePosition(fixedPos: DeepReadonly<Vector2>) {
  if (programRef.value === null) {
    throw new Error("programRef is null.");
  }
  const boundingRect = programRef.value.getBoundingClientRect();
  return [
    fixedPos[0] - boundingRect.x + scrollX.value,
    fixedPos[1] - boundingRect.y,
  ];
}
provide(getAbsolutePositionKey, getAbsolutePosition);

provide(willBeDeletedKey, (fixedPos: DeepReadonly<Vector2>) => {
  if (programRef.value === null) {
    throw new Error("programRef is null.");
  }
  const boundingRect = programRef.value.getBoundingClientRect();
  return fixedPos[1] >= boundingRect.y + boundingRect.height;
});

function wheel(e: WheelEvent) {
  e.preventDefault();
  scrollX.value = normalizeScrollX(scrollX.value + e.deltaX);
}
</script>

<style scoped>
.program {
  flex: 1;
  overflow: hidden;
  position: relative;
}
.running {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 5px solid #1de9b6;
  box-sizing: border-box;
}
</style>
