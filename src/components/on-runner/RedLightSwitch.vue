<template>
  <div class="control">
    <label for="red-light-switch">{{ t("runner.redLight") }}:</label>
    <input
      id="red-light-switch"
      type="checkbox"
      v-model="check"
      @change="update"
    />
  </div>
</template>

<script lang="ts">
export default {
  name: "RedLightSwitch",
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
const inputName = "red-light";
registerInput(inputName);
onUnmounted(() => {
  unregisterInput(inputName);
});

const check = ref(false);
watch(runnerInputs, () => {
  check.value = runnerInputs[inputName] === 1;
});
const update = () => {
  updateRunnerInput(inputName, check.value ? 1 : 0);
};
</script>

<style scoped>
#red-light-switch {
  margin-left: 50px;
}
</style>
