<template>
  <div
    class="tray-block"
    @mousedown="down"
    @touchstart="down"
    @pointerenter="pointerenter"
    @pointerleave="pointerleave"
    ref="blockElem"
    :style="{ transform: `translateY(${block.design.bottomAnchor}px)` }"
  >
    <teleport to=".app" v-if="showDescription">
      <div
        class="description"
        :style="{ top: `${y}px`, left: `${x}px`, width: `${width}px` }"
      >
        <h2>{{ displayName }}</h2>
        {{ t(block.design.description) }}
        <template v-if="block.params !== null">
          <h3>{{ t(matterName) }}</h3>
          {{ t(matterDescription) }}
        </template>
      </div>
    </teleport>
    <svg
      :width="block.design.width"
      :height="block.design.height + block.design.bottomAnchor"
    >
      <g :transform="`translate(0, ${block.design.height})`">
        <BlockVue
          :x="0"
          :y="0"
          :block="block"
          :update-block="(updater) => updater(block)"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.tray-block {
  position: relative;
  display: flex; /* for height-adjustment */
  touch-action: none;
  user-select: none;
}
.description {
  position: absolute;
  background-color: white;
  border-radius: 10px;
  border: 1px solid #aaa;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  transform: translateY(calc(-100% - 20px));
}
h2 {
  margin: 0 0 10px 0;
  font-size: 18px;
}
h3 {
  margin: 8px 0 3px 0;
  font-size: 16px;
}
</style>

<script setup lang="ts">
import { useStore } from "../store";
import { Ref, ref, defineProps, computed } from "vue";
import BlockVue from "@/components/Block.vue";
import type { FinalBlock } from "@/utils/block";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps<{
  blockClass: FinalBlock;
}>();

const blockElem: Ref<HTMLElement | null> = ref(null);
const block = ref(new props.blockClass());
const { addTempBlock } = useStore();
const down = () => {
  if (blockElem.value !== null) {
    const boundingRect = blockElem.value.getBoundingClientRect();
    addTempBlock(block.value, [
      boundingRect.x,
      boundingRect.y + boundingRect.height - block.value.design.bottomAnchor,
    ]);
    block.value = new props.blockClass();
  }
};
const x = ref(0);
const y = ref(0);
const width = ref(0);
const showDescription = ref(false);
let timeoutId: number | null = null;
const pointerenter = () => {
  if (blockElem.value !== null) {
    const boundingRect = blockElem.value.getBoundingClientRect();
    x.value = boundingRect.x;
    y.value = boundingRect.y + block.value.design.bottomAnchor;
    width.value = boundingRect.width;
    timeoutId = setTimeout(() => {
      timeoutId = null;
      showDescription.value = true;
    }, 300);
  }
};
const pointerleave = () => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }
  showDescription.value = false;
};
const displayName = computed(() =>
  t(block.value.design.displayName).replace(/<[^,]+,([^>]*)>/g, "$1")
);
const matterName = computed(() => {
  if (block.value.params === null) return "";
  return block.value.params[Object.keys(block.value.params)[0]].value;
});
const matterDescription = computed(() => {
  if (block.value.params === null) return "";
  const nameAddress =
    block.value.params[Object.keys(block.value.params)[0]].value;
  return `${nameAddress.substring(
    0,
    nameAddress.length - ".name".length
  )}.description`;
});
</script>
