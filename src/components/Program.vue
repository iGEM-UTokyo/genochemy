<template>
  <div class="program" ref="programRef">
    <Snake v-for="snake in snakes" :key="snake.uuid" :snake="snake" />
  </div>
</template>

<script lang="ts">
export const getFixedPositionKey: InjectionKey<
  (absolutePos: Vector2) => Vector2
> = Symbol("getFixedPosition");
export const getAbsolutePositionKey: InjectionKey<
  (fixedPos: Vector2) => Vector2
> = Symbol("getAbsolutePosition");
</script>

<script setup lang="ts">
import { InjectionKey, provide, Ref, ref } from "vue";
import { useStore } from "../store";
import Snake from "@/components/Snake.vue";
import { Vector2 } from "@/utils/block";

const { snakes } = useStore();

const programRef: Ref<HTMLElement | null> = ref(null);

provide(getFixedPositionKey, (absolutePos: Vector2) => {
  if (programRef.value === null) {
    throw new Error("programRef is null.");
  }
  const boundingRect = programRef.value.getBoundingClientRect();
  return [absolutePos[0] + boundingRect.x, absolutePos[1] + boundingRect.y];
});

provide(getAbsolutePositionKey, (fixedPos: Vector2) => {
  if (programRef.value === null) {
    throw new Error("programRef is null.");
  }
  const boundingRect = programRef.value.getBoundingClientRect();
  return [fixedPos[0] - boundingRect.x, fixedPos[1] - boundingRect.y];
});
</script>

<style scoped>
.program {
  flex: 1;
  overflow: scroll;
  position: relative;
}
</style>
