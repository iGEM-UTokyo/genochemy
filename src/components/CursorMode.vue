<template>
  <div class="cursor-mode">
    <IconButton
      class="cursor-button"
      style="right: 70px"
      :active="props.modelValue === 'move'"
      @click="emit('update:modelValue', 'move')"
    >
      <font-awesome-icon icon="arrows-up-down-left-right" />
    </IconButton>
    <IconButton
      class="cursor-button"
      style="right: 10px"
      :active="props.modelValue === 'wrap'"
      @click="emit('update:modelValue', 'wrap')"
    >
      <font-awesome-icon icon="wave-square" />
    </IconButton>
  </div>
</template>

<script lang="ts">
export type CursorMode = "move" | "wrap";
</script>

<script setup lang="ts">
import { ref } from "vue";
import IconButton from "./IconButton.vue";
const props = defineProps<{
  modelValue?: CursorMode;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: CursorMode): void;
}>();
</script>

<style scoped>
.cursor-mode {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
}
</style>
