<template>
  <IconButton @click="open" background-color="#5E35B1" color="white">
    <font-awesome-icon icon="dna" />
  </IconButton>
  <Dialog v-model="showDialog" title="vDNA.title">
    {{ t("vDNA.description") }}
    <div v-text="vDNATexts" style="white-space: pre-wrap; width: 100%"></div>
  </Dialog>
</template>

<script lang="ts" setup>
import IconButton from "./IconButton.vue";
import Dialog from "./Dialog.vue";
import { computed, ref, toRefs } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";
import { VDNA, toVDNAs } from "@/utils/v-dna";

const { t } = useI18n();
const showDialog = ref(false);
const vDNAs = ref<VDNA[]>([]);
const { snakes, isRunning, beforePlaySnakes } = toRefs(useStore());
const open = () => {
  showDialog.value = true;
  const _snakes = isRunning ? snakes.value : beforePlaySnakes.value;
  vDNAs.value = toVDNAs(Object.values(_snakes));
};
const vDNATexts = computed(() =>
  vDNAs.value.map((vDNA) => vDNA.vDNA).join("\n")
);
</script>

<style scoped></style>
