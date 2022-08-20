<template>
  <div
    :class="{ 'icon-button': true, active: props.active }"
    @click="emit('click')"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
const props = defineProps<{
  active?: boolean;
}>();
const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<style scoped>
.icon-button {
  width: 50px;
  height: 50px;
  border-radius: 30px;
  border: 1px solid #aaa;
  text-align: center;
  line-height: 50px;
}
.active {
  background-color: #0097a7;
  color: white;
  border: 1px solid #006064;
}
</style>
