<template>
  <div class="listbox">
    <div
      class="listbox-item"
      v-for="item of list"
      :key="item"
      :class="{ 'active-listbox-item': modelValue === item }"
      @click="update(item)"
    >
      {{ t(item) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, defineProps, defineEmits, toRefs } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps<{
  list: string[];
  modelValue?: string;
}>();
const { list, modelValue } = toRefs(props);
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
const update = (item: string) => {
  emit("update:modelValue", item);
};
watch(list, (newList, oldList) => {
  if (newList.length === 0) {
    update("");
  }
});
</script>

<style scoped>
.listbox {
  /* padding: 10px; */
  border: 1px solid #aaa;
}
.listbox-item {
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.listbox-item.active-listbox-item {
  background-color: #ccc;
}
</style>
