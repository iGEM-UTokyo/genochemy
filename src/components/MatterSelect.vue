<template>
  <div class="select" ref="selectElem" @click="toggleShowOptions">
    <div class="select-inner">{{ t(modelValue) }}</div>
    <span class="select-icon"
      ><font-awesome-icon :icon="showOptions ? 'caret-up' : 'caret-down'"
    /></span>
    <teleport to=".app" v-if="showOptions">
      <ul
        class="options"
        :style="{
          top: `${optionsY}px`,
          left: `${optionsX}px`,
          width: `${optionsWidth}px`,
        }"
      >
        <li
          v-for="item of list"
          :key="item"
          @pointerenter="pointerenter(item)"
          @pointerleave="pointerleave"
          @click="select(item)"
        >
          {{ t(item) }}
        </li>
      </ul>
    </teleport>
  </div>
  <tooltip
    :rect="rect"
    :show="showHint"
    show-to-side
    :width="150"
    :height="200"
  >
    <matter-description :matterName="matterName" />
  </tooltip>
</template>

<script lang="ts" setup>
import { computed, ref, Ref } from "vue";
import { useI18n } from "vue-i18n";
import Tooltip from "./tooltip/Tooltip.vue";
import MatterDescription from "./tooltip/MatterDescription.vue";

const { t } = useI18n();

const props = defineProps<{
  modelValue: string;
  list: readonly string[];
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
const selectElem: Ref<HTMLElement | null> = ref(null);
const rect = computed(() => {
  return selectElem.value?.getBoundingClientRect() ?? null;
});
const showOptions = ref(false);
const toggleShowOptions = (e: MouseEvent) => {
  if (!showOptions.value) {
    showOptions.value = true;
    e.stopPropagation();
    window.addEventListener("click", hideOptions);
  } else {
    hideOptions();
  }
};
const hideOptions = () => {
  showOptions.value = false;
  window.removeEventListener("click", hideOptions);
};
const select = (newValue: string) => {
  emit("update:modelValue", newValue);
  showHint.value = false;
};
const optionsX = computed(() => rect.value?.x ?? 0);
const optionsY = computed(() =>
  !rect.value ? 0 : rect.value.y + rect.value.height
);
const optionsWidth = computed(() => rect.value?.width ?? 0);
const matterName = ref("");
const showHint = ref(false);
let enterTimeoutId: number | null = null;
let leaveTimeoutId: number | null = null;
const pointerenter = (_matterName: string) => {
  if (leaveTimeoutId !== null) {
    clearTimeout(leaveTimeoutId);
    leaveTimeoutId = null;
  }
  if (enterTimeoutId !== null) {
    clearTimeout(enterTimeoutId);
  }
  enterTimeoutId = setTimeout(() => {
    enterTimeoutId = null;
    showHint.value = true;
    matterName.value = _matterName;
  }, 100);
};
const pointerleave = () => {
  if (enterTimeoutId !== null) {
    clearTimeout(enterTimeoutId);
    enterTimeoutId = null;
  }
  leaveTimeoutId = setTimeout(() => {
    leaveTimeoutId = null;
    showHint.value = false;
  }, 100);
};
</script>

<style scoped>
.select {
  flex: 1;
  font-size: 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1px;
  display: flex;
  align-items: center;
  position: relative;
  user-select: none;
}
.select-inner {
  flex: 1;
}
.select-icon {
  margin-right: 1px;
  color: rgba(255, 255, 255, 0.8);
}

.options {
  position: fixed;
  z-index: 2;
  color: black;
  list-style-type: none;
  padding: 0;
  border: 1px solid #ddd;
  margin: 0;
  font-size: 14px;
  user-select: none;
  background-color: white;
}
.options li {
  padding: 0 3px;
}
.options li:hover {
  background-color: #eee;
}
select {
  background-color: inherit;
  flex: 1;
  min-width: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: white;
  margin-top: 2px;
  font-family: inherit;
}
select:focus-visible {
  outline: none;
}
option {
  color: black;
}
</style>
