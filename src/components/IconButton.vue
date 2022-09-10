<template>
  <div
    :class="{ 'icon-button': true, active: props.active }"
    :style="style"
    @click="emit('click')"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
const props = defineProps<{
  active?: boolean;
  backgroundColor?: string;
  color?: string;
}>();
const emit = defineEmits<{
  (e: "click"): void;
}>();
const style = computed(() => ({
  ...(props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}),
  ...(props.color ? { color: props.color } : {}),
}));
</script>

<style scoped>
.icon-button {
  width: 50px;
  height: 50px;
  border-radius: 30px;
  border: 1px solid #aaa;
  text-align: center;
  line-height: 50px;
  background-color: white;
}
.active {
  background-color: #0097a7;
  color: white;
  border: 1px solid #006064;
}
</style>
