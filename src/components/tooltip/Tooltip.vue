<template>
  <teleport to=".app" v-if="show || keepShowing">
    <div
      class="tooltip"
      :style="{
        top: `${y}px`,
        left: `${x}px`,
        width: `${width}px`,
        maxHeight: `${maxHeight}px`,
        height,
        transform,
      }"
      @pointerenter="pointerenter"
      @pointerleave="pointerleave"
    >
      <slot />
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

const margin = 10;
const props = defineProps<{
  rect: DOMRect | null;
  show: boolean;
  showToSide?: boolean;
  width?: number;
  height?: number;
}>();
const keepShowing = ref(false);
const showOnTop = computed(() => {
  if (!props.rect || props.showToSide) return false;
  return (
    props.rect.y - 0 > window.innerHeight - (props.rect.y + props.rect.height)
  );
});
const showOnLeft = computed(() => {
  if (!props.rect || !props.showToSide) return false;
  return (
    props.rect.x - 0 > window.innerWidth - (props.rect.x + props.rect.width)
  );
});
const x = computed(() => {
  if (!props.rect) return 0;
  if (props.showToSide) {
    return showOnLeft.value
      ? props.rect.x - margin
      : props.rect.x + props.rect.width + margin;
  }
  return props.rect.x;
});
const y = computed(() => {
  if (!props.rect) return 0;
  if (props.showToSide) {
    return props.rect.y;
  }
  return showOnTop.value
    ? props.rect.y - margin
    : props.rect.y + props.rect.height + margin;
});
const width = computed(() => props.width ?? props.rect?.width ?? 0);
const maxHeight = computed(() => {
  if (!props.rect) return 0;
  if (showOnTop.value) {
    return Math.max(0, props.rect.y - 0 - margin * 2);
  }
  return Math.max(
    window.innerHeight - (props.rect.y + props.rect.height) - margin * 2
  );
});
const height = computed(() => {
  if (props.showToSide) {
    return `${props.height ?? 100}px`;
  }
  return props.height ? `${props.height}px` : "auto";
});
const transform = computed(() => {
  if (props.showToSide) {
    if (showOnLeft.value) {
      return "translateX(-100%)";
    }
    return "none";
  }
  if (showOnTop.value) {
    return "translateY(-100%)";
  }
  return "none";
});
const pointerenter = () => {
  keepShowing.value = true;
};
const pointerleave = () => {
  keepShowing.value = false;
};
</script>

<style>
.tooltip {
  position: fixed;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #aaa;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
}
.tooltip h2 {
  margin: 0 0 10px 0;
  font-size: 18px;
}
.tooltip h3 {
  margin: 8px 0 3px 0;
  font-size: 16px;
}
</style>
