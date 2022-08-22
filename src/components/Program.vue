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
        :viewportWidth="programRef?.clientWidth ?? 0"
        :viewportHeight="programRef?.clientHeight ?? 0"
        :min-x="limits[0][0]"
        :max-x="limits[1][0]"
        v-model="scrollX"
      />
    </svg>
    <DraggingSnake v-if="draggingSnake !== null" v-model="draggingSnake" />
    <CursorMode v-model="cursorMode" />
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

const { snakes, draggingSnake: _draggingSnake } = toRefs(useStore());
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
      [0, 0],
      [programRef.value?.clientWidth ?? 0, programRef.value?.clientHeight ?? 0],
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
</style>
