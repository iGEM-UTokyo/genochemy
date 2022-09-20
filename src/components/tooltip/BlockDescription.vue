<template>
  <h2>{{ displayName }}</h2>
  {{ t(block.design.description) }}
  <matter-description v-if="block.params !== null" :matter-name="matterName" />
</template>

<script lang="ts" setup>
import { Block } from "@/utils/block";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MatterDescription from "./MatterDescription.vue";

const { t } = useI18n();
const props = defineProps<{
  block: Block;
}>();
const displayName = computed(() =>
  t(props.block.design.displayName).replace(/<[^,]+,([^>]*)>/g, "$1")
);
const matterName = computed(() => {
  if (props.block.params === null) return "";
  return props.block.params[Object.keys(props.block.params)[0]].value;
});
</script>
