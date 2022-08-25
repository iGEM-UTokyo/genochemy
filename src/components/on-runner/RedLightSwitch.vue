<template>
  <div class="control">
    <label for="red-light-switch">赤色光:</label>
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
const { registerInput, UnregisterInput, runnerInputs, updateRunnerInput } =
  useStore();
const inputName = "red-light";
registerInput(inputName);
onUnmounted(() => {
  UnregisterInput(inputName);
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
