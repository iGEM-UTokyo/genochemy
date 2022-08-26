<template>
  <rect
    :x="viewportWidth - 15"
    :y="vScrollBarY"
    :width="10"
    :height="vScrollBarHeight"
    fill="#aaa"
    :rx="5"
    :ry="5"
    @pointerdown="down"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  viewportWidth: number;
  viewportHeight: number;
  minY: number;
  maxY: number;
  modelValue: number;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();
const totalHeight = computed(() => props.maxY - props.minY);
const vScrollBarHeight = computed(() => {
  if (totalHeight.value === 0) return 0;
  const height =
    (props.viewportHeight / totalHeight.value) * (props.viewportHeight - 10);
  if (height >= props.viewportHeight - 10) return 0;
  return height;
});
const vScrollBarY = computed(() => {
  if (totalHeight.value === 0) return 5;
  return (
    ((props.modelValue - props.minY) / totalHeight.value) *
      (props.viewportHeight - 10) +
    5
  );
});
function down() {
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
function move(e: PointerEvent) {
  let newY = props.modelValue + e.movementY;
  if (newY > totalHeight.value - props.viewportHeight) {
    newY = totalHeight.value - props.viewportHeight;
  }
  if (newY < 0) newY = 0;
  emit("update:modelValue", newY);
}
function up() {
  window.removeEventListener("pointermove", move);
  window.removeEventListener("pointerup", up);
}
</script>
