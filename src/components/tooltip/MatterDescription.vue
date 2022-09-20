<template>
  <h3>{{ t(matterName) }}</h3>
  {{ t(matterDescription) }}
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  matterName: string;
}>();
const matterDescription = computed(() => {
  return `${props.matterName.substring(
    0,
    props.matterName.length - ".name".length
  )}.description`;
});
</script>
