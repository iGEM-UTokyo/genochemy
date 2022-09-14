<template>
  <div class="tabs">
    <div
      class="tab-item"
      v-for="tab of tabs"
      :key="tab"
      :class="{ 'active-tab-item': tab === modelValue }"
      @click="update(tab)"
    >
      {{ tab }}
    </div>
    <div class="tabs-right">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, toRefs } from "vue";

const props = defineProps<{
  modelValue: string;
  tabs: string[];
}>();
const { modelValue } = toRefs(props);
const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
const update = (tab: string) => {
  emits("update:modelValue", tab);
};
</script>

<style scoped>
.tabs {
  margin-top: 5px;
  display: flex;
  align-items: center;
  user-select: none;
}
.tab-item {
  padding: 5px 10px;
  border: 1px solid #aaa;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid #aaa;
}
.tab-item.active-tab-item {
  border-bottom: none;
}
.tabs-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid #aaa;
}
</style>
