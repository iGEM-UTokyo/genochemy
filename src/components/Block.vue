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
      <div>
        <template v-for="(element, index) of elements" :key="index">
          <select v-if="element.type === 'options'" v-model="paramValue">
            <option v-for="item of element.items" :key="item" :value="item">
              {{ t(item) }}
            </option>
          </select>
          <span v-else>{{ element.text }}</span>
        </template>
      </div>
    </foreignObject>
  </g>
</template>

<style scoped>
div {
  box-sizing: border-box;
  height: 100%;
  padding: 2px 10px 4px 10px;
  color: white;
  user-select: none;
  display: flex;
  gap: 5px;
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

<script setup lang="ts">
import { Block, BlockWithUUID } from "../utils/block";
import { defineProps, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";

const { t } = useI18n();
const { updateBlock } = useStore();

const props = defineProps<{
  x: number;
  y: number;
  snakeUUID?: string;
  block: Block | BlockWithUUID;
}>();
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
    if (props.snakeUUID && props.block.uuid) {
      updateBlock(props.snakeUUID, props.block.uuid, (block: BlockWithUUID) => {
        if (block.params === null) return block;
        block.params[Object.keys(block.params)[0]].value = value;
        return block;
      });
    }
  },
});
</script>
