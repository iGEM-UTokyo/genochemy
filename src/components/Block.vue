<template>
  <!-- <div :style="divStyle"> -->
  <g>
    <image :href="src" :width="props.block.design.width" :x="props.x" :y="_y" />
    <foreignObject
      :x="props.x + props.block.design.marginLeft"
      :y="props.y - 30"
      :width="
        props.block.design.width -
        props.block.design.marginLeft -
        props.block.design.marginRight
      "
      :height="30"
    >
      <div
        class="block-inner"
        ref="blockElem"
        @pointerenter="pointerenter"
        @pointerleave="pointerleave"
      >
        <template v-for="(element, index) of elements" :key="index">
          <matter-select
            v-if="element.type === 'options'"
            v-model="paramValue"
            :list="element.items"
          />
          <span v-else>{{ element.text }}</span>
        </template>
      </div>
      <tooltip :rect="rect" :show="Boolean(showTooltip) && showDescription">
        <block-description :block="props.block" />
      </tooltip>
    </foreignObject>
  </g>
</template>

<style>
.block-inner {
  box-sizing: border-box;
  height: 100%;
  padding: 2px 10px 4px 10px;
  color: white;
  user-select: none;
  display: flex;
  gap: 5px;
}
</style>

<script setup lang="ts">
import { Block, BlockWithUUID } from "../utils/block";
import { defineProps, computed, ref, Ref } from "vue";
import { useI18n } from "vue-i18n";
import Tooltip from "./tooltip/Tooltip.vue";
import BlockDescription from "./tooltip/BlockDescription.vue";
import MatterSelect from "./MatterSelect.vue";

const { t } = useI18n();

const props = defineProps<{
  x: number;
  y: number;
  block: Block | BlockWithUUID;
  updateBlock: (
    updater: <T extends Block | BlockWithUUID>(block: T) => T
  ) => void;
  showTooltip?: boolean;
}>();
const blockElem: Ref<HTMLElement | null> = ref(null);
const src = computed(() => props.block.design.imageSrc);
const displayName = computed(() => props.block.design.displayName);
const _y = computed(
  () => -props.block.design.height + props.y + props.block.design.bottomAnchor
);
const elements = computed(() => {
  const tDisplayName = t(displayName.value);
  const regExp = /<([^>]+)>/g;
  let cursor = 0;
  let execResult = regExp.exec(tDisplayName);
  const elements: (
    | { type: "options"; items: readonly string[] }
    | { type: "text"; text: string }
  )[] = [];
  while (execResult !== null && cursor < tDisplayName.length) {
    const textBetweenSelect = tDisplayName.substring(cursor, execResult.index);
    if (textBetweenSelect !== "") {
      elements.push({ type: "text", text: textBetweenSelect });
    }
    if (props.block.params === null) {
      throw new Error(
        `Placeholder is not supported in the block ${t(
          props.block.design.displayName
        )}`
      );
    }
    const paramName = execResult[1].split(",")[0];
    if (!(paramName in props.block.params)) {
      throw new Error(
        `Placeholder ${paramName} is not supported in the block ${t(
          props.block.design.displayName
        )}`
      );
    }
    elements.push({
      type: "options",
      items: props.block.params[paramName].list,
    });
    cursor = execResult.index + execResult[0].length;
    execResult = regExp.exec(tDisplayName);
  }
  if (cursor < tDisplayName.length - 1) {
    elements.push({
      type: "text",
      text: tDisplayName.substring(cursor),
    });
  }
  return elements;
});

// todo: support for multiple options
const paramValue = computed({
  get() {
    const params = props.block.params;
    if (params === null) return "";
    return params[Object.keys(params)[0]].value;
  },
  set(value: string) {
    props.updateBlock((block) => {
      if (block.params === null) return block;
      block.params[Object.keys(block.params)[0]].value = value;
      return block;
    });
  },
});
const rect: Ref<DOMRect | null> = ref(null);
const showDescription = ref(false);
let enterTimeoutId: number | null = null;
let leaveTimeoutId: number | null = null;
const pointerenter = () => {
  if (leaveTimeoutId !== null) {
    clearTimeout(leaveTimeoutId);
    leaveTimeoutId = null;
  }
  enterTimeoutId = setTimeout(() => {
    enterTimeoutId = null;
    rect.value = blockElem.value?.getBoundingClientRect() ?? null;
    showDescription.value = true;
  }, 300);
};
const pointerleave = () => {
  if (enterTimeoutId !== null) {
    clearTimeout(enterTimeoutId);
    enterTimeoutId = null;
  }
  leaveTimeoutId = setTimeout(() => {
    leaveTimeoutId = null;
    showDescription.value = false;
  }, 100);
};
</script>
