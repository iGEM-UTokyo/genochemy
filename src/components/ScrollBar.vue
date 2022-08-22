<template>
  <rect
    :x="hScrollBarX"
    :y="viewportHeight - 15"
    :width="hScrollBarWidth"
    :height="10"
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
  minX: number;
  maxX: number;
  modelValue: number;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
}>();
const totalWidth = computed(() => props.maxX - props.minX);
const hScrollBarWidth = computed(() => {
  if (totalWidth.value === 0) return 0;
  const width =
    (props.viewportWidth / totalWidth.value) * (props.viewportWidth - 10);
  if (width >= props.viewportWidth - 10) return 0;
  return width;
});
const hScrollBarX = computed(() => {
  if (totalWidth.value === 0) return 5;
  return (
    ((props.modelValue - props.minX) / totalWidth.value) *
      (props.viewportWidth - 10) +
    5
  );
});
function down() {
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
}
function move(e: PointerEvent) {
  let newX = props.modelValue + e.movementX;
  if (newX > totalWidth.value - props.viewportWidth) {
    newX = totalWidth.value - props.viewportWidth;
  }
  if (newX < 0) newX = 0;
  emit("update:modelValue", newX);
}
function up() {
  window.removeEventListener("pointermove", move);
  window.removeEventListener("pointerup", up);
}
</script>
