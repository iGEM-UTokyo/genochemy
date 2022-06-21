<template>
  <div class="program" ref="programRef">
    <div
      class="inner-program"
      :style="{ width: `${size[0]}px`, height: `${size[1]}px` }"
    >
      <Snake v-for="snake in snakes" :key="snake.uuid" :snake="snake" />
    </div>
  </div>
</template>

<script lang="ts">
import { InjectionKey, provide, Ref, ref, computed } from "vue";
import { useStore } from "../store";
import Snake from "@/components/Snake.vue";
import { Vector2 } from "@/utils/block";

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
const { snakes } = useStore();

const programRef: Ref<HTMLElement | null> = ref(null);

const size = computed(() => {
  return Object.values(snakes).reduce(
    (a, b) => [
      Math.max(a[0], b.anchorNext[0]),
      Math.max(a[1], b.anchorNext[1]),
    ],
    [0, 0]
  );
});

provide(getFixedPositionKey, (absolutePos: Vector2) => {
  if (programRef.value === null) {
    throw new Error("programRef is null.");
  }
  const boundingRect = programRef.value.getBoundingClientRect();
  return [
    absolutePos[0] + boundingRect.x - programRef.value.scrollLeft,
    absolutePos[1] + boundingRect.y - programRef.value.scrollTop,
  ];
});

provide(getAbsolutePositionKey, (fixedPos: Vector2) => {
  if (programRef.value === null) {
    throw new Error("programRef is null.");
  }
  const boundingRect = programRef.value.getBoundingClientRect();
  return [
    fixedPos[0] - boundingRect.x + programRef.value.scrollLeft,
    fixedPos[1] - boundingRect.y + programRef.value.scrollTop,
  ];
});

provide(willBeDeletedKey, (fixedPos: Vector2) => {
  if (programRef.value === null) {
    throw new Error("programRef is null.");
  }
  const boundingRect = programRef.value.getBoundingClientRect();
  return fixedPos[1] >= boundingRect.y + boundingRect.height;
});
</script>

<style scoped>
.program {
  flex: 1;
  overflow: auto;
  position: relative;
}
</style>
