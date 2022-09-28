<template>
  <div class="runner">
    <div class="stage-settings">
      <component
        v-for="(setting, index) of stageSettings"
        :key="index"
        :is="setting"
      />
    </div>
    <img :src="genomyImg" class="bacterium" />
    <div class="gui">
      <component
        v-for="(guiView, index) of guiViews"
        :key="index"
        :is="guiView"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RunnerComponent } from "@/utils/matter";
import { computed, markRaw, onUnmounted, ref, toRefs, watch } from "vue";
import { useStore } from "../store";
import BlueLightSwitchVue from "./on-runner/BlueLightSwitch.vue";
import RedLightSwitchVue from "./on-runner/RedLightSwitch.vue";
import DrugAVue from "./on-runner/DrugA.vue";
import BlueLightVue from "./on-runner/BlueLight.vue";
import RedLightVue from "./on-runner/RedLight.vue";

const store = useStore();
const { registerOutput, unregisterOutput } = store;
const { proteins, runnerOutputs, isRunning } = toRefs(store);

const defaultStageSettings: Record<string, RunnerComponent> = {
  [BlueLightVue.name]: markRaw(BlueLightVue),
  [RedLightVue.name]: markRaw(RedLightVue),
};
const defaultGUIViews: Record<string, RunnerComponent> = {
  [DrugAVue.name]: markRaw(DrugAVue),
  [BlueLightSwitchVue.name]: markRaw(BlueLightSwitchVue),
  [RedLightSwitchVue.name]: markRaw(RedLightSwitchVue),
};

let accumulatedProteins: string[] = [];
const stageSettings = ref<Record<string, RunnerComponent>>({
  ...defaultStageSettings,
});
const guiViews = ref<Record<string, RunnerComponent>>({ ...defaultGUIViews });
const reset = () => {
  stageSettings.value = { ...defaultStageSettings };
  guiViews.value = { ...defaultGUIViews };
  accumulatedProteins = [];
  for (const protein of proteins.value) {
    accumulatedProteins.push(protein.name);
    for (const stageSetting of protein.stageSettings) {
      if (!stageSettings.value[stageSetting.name]) {
        stageSettings.value[stageSetting.name] = markRaw(stageSetting);
      }
    }
    for (const guiView of protein.guiViews) {
      if (!guiViews.value[guiView.name]) {
        guiViews.value[guiView.name] = markRaw(guiView);
      }
    }
  }
};
watch(proteins, () => {
  if (isRunning.value) {
    for (const protein of proteins.value) {
      if (!accumulatedProteins.includes(protein.name)) {
        accumulatedProteins.push(protein.name);
        for (const stageSetting of protein.stageSettings) {
          if (!stageSettings.value[stageSetting.name]) {
            stageSettings.value[stageSetting.name] = markRaw(stageSetting);
          }
        }
        for (const guiView of protein.guiViews) {
          if (!guiViews.value[guiView.name]) {
            guiViews.value[guiView.name] = markRaw(guiView);
          }
        }
      }
    }
  } else {
    reset();
  }
});
watch(isRunning, () => {
  if (!isRunning.value) {
    reset();
  }
});

registerOutput("kill");
onUnmounted(() => {
  unregisterOutput("kill");
});

const genomyImg = computed(() =>
  runnerOutputs.value["kill"] === 1
    ? "/runner/killed-bacterium.svg"
    : "/runner/bacterium.svg"
);
</script>

<style scoped>
.runner {
  height: 300px;
  flex-shrink: 0;
  border: 1px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  user-select: none;
}
.bacterium {
  height: 200px;
  pointer-events: none;
}
.stage-settings {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.gui {
  position: absolute;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  bottom: 10px;
}
</style>
