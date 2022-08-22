<template>
  <div class="program" ref="programRef" @wheel="wheel">
    <svg style="width: 100%; height: 100%">
      <g class="program-inner" :transform="`translate(${-scrollX})`">
        <g class="program-inner-back" />
        <Snake
          v-for="snake in filteredSnakes"
          :key="snake.uuid"
          :snake="snake"
          :cursor-mode="cursorMode"
        />
      </g>
      <ScrollBar
        :viewportWidth="programRef?.clientWidth ?? 0"
        :viewportHeight="programRef?.clientHeight ?? 0"
        :totalWidth="size[0]"
        v-model="scrollX"
      />
    </svg>
    <DraggingSnake v-if="draggingSnake !== null" :snake="draggingSnake" />
    <CursorMode v-model="cursorMode" />
  </div>
</template>

<script lang="ts">
import { InjectionKey, provide, Ref, ref, computed, toRefs, watch } from "vue";
import { useStore } from "../store";
import Snake from "@/components/Snake.vue";
import DraggingSnake from "@/components/DraggingSnake.vue";
import { Vector2 } from "@/utils/block";
import ScrollBar from "@/components/ScrollBar.vue";

export const getFixedPositionKey: InjectionKey<
  (absolutePos: Vector2) => Vector2
> = Symbol("getFixedPosition");
export const getAbsolutePositionKey: InjectionKey<
  (fixedPos: Vector2) => Vector2
> = Symbol("getAbsolutePosition");
export const willBeDeletedKey: InjectionKey<(fixedPos: Vector2) => boolean> =
  Symbol("wellBeDeleted");
</script>

<script setup lang="ts">
import CursorMode, {
  CursorMode as CursorModeType,
} from "@/components/CursorMode.vue";

const { snakes, draggingSnake } = toRefs(useStore());

const filteredSnakes = computed(() =>
  Object.values(snakes.value).filter((snake) => snake.visible)
);

const programRef: Ref<HTMLElement | null> = ref(null);

const scrollX = ref(0);

const size = computed(() => {
  return Object.values(snakes.value).reduce(
    (a, b) => [
      Math.max(a[0], b.anchorNext[0] + 20),
      Math.max(a[1], b.anchorNext[1] + 20),
    ],
    [0, 0]
  );
});

function normalizeScrollX(newScrollX: number) {
  return Math.min(
    Math.max(newScrollX, 0),
    Math.max(size.value[0] - (programRef.value?.clientWidth ?? 0), 0)
  );
}

watch(size, () => {
  scrollX.value = normalizeScrollX(scrollX.value);
});

const cursorMode = ref<CursorModeType>("move");

provide(getFixedPositionKey, (absolutePos: Vector2) => {
  if (programRef.value === null) {
    throw new Error("programRef is null.");
  }
  const boundingRect = programRef.value.getBoundingClientRect();
  return [
    absolutePos[0] + boundingRect.x - scrollX.value,
    absolutePos[1] + boundingRect.y,
  ];
});

provide(getAbsolutePositionKey, (fixedPos: Vector2) => {
  if (programRef.value === null) {
    throw new Error("programRef is null.");
  }
  const boundingRect = programRef.value.getBoundingClientRect();
  return [
    fixedPos[0] - boundingRect.x + scrollX.value,
    fixedPos[1] - boundingRect.y,
  ];
});

provide(willBeDeletedKey, (fixedPos: Vector2) => {
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
