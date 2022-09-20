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
          minWidth: `${optionsWidth}px`,
        }"
        ref="optionElem"
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
    :rect="optionRect"
    :show="showHint"
    show-to-side
    :width="150"
    :height="150"
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
const optionElem: Ref<HTMLElement | null> = ref(null);
const selectRect: Ref<DOMRect | null> = ref(null);
const optionRect: Ref<DOMRect | null> = ref(null);
const showOptions = ref(false);
const toggleShowOptions = () => {
  if (!showOptions.value) {
    selectRect.value = selectElem.value?.getBoundingClientRect() ?? null;
    showOptions.value = true;
    window.addEventListener("click", hideOptions);
  } else {
    hideOptions();
  }
};
const hideOptions = (e?: MouseEvent) => {
  if (!e || e.target !== selectElem.value) {
    showOptions.value = false;
    window.removeEventListener("click", hideOptions);
  }
};
const select = (newValue: string) => {
  emit("update:modelValue", newValue);
  showHint.value = false;
};
const optionsX = computed(() => selectRect.value?.x ?? 0);
const optionsY = computed(() =>
  !selectRect.value ? 0 : selectRect.value.y + selectRect.value.height
);
const optionsWidth = computed(() => selectRect.value?.width ?? 0);
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
    optionRect.value = optionElem.value?.getBoundingClientRect() ?? null;
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
  white-space: nowrap;
  min-width: 20px;
}
.select-inner {
  flex: 1;
  pointer-events: none;
  min-width: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.select-icon {
  margin-right: 1px;
  color: rgba(255, 255, 255, 0.8);
  pointer-events: none;
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
  white-space: nowrap;
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
