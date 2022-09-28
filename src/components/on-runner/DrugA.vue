<template>
  <div class="drug-a">
    {{ t("runner.drugA") }}:
    <input
      class="drug"
      type="range"
      v-model="drug"
      @change="update"
      min="0"
      max="1"
      step="0.01"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: "DrugA",
  customOptions: {},
};
</script>

<script setup lang="ts">
import { onUnmounted, ref, watch } from "vue";
import { useStore } from "@/store";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { registerInput, unregisterInput, runnerInputs, updateRunnerInput } =
  useStore();
const inputName = "drug";
registerInput(inputName);
onUnmounted(() => {
  unregisterInput(inputName);
});

const drug = ref(0);
watch(runnerInputs, () => {
  drug.value = runnerInputs[inputName];
});
const update = () => {
  updateRunnerInput(inputName, drug.value);
};
</script>

<style scoped>
.drug-a {
  display: flex;
}
.drug {
  flex: 1;
}
</style>
