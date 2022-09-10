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
import { computed, onUnmounted, toRefs } from "vue";
import { useStore } from "../store";
import BlueLightSwitchVue from "./on-runner/BlueLightSwitch.vue";
import RedLightSwitchVue from "./on-runner/RedLightSwitch.vue";
import DrugAVue from "./on-runner/DrugA.vue";
import BlueLightVue from "./on-runner/BlueLight.vue";
import RedLightVue from "./on-runner/RedLight.vue";

const store = useStore();
const { registerOutput, UnregisterOutput } = store;
const { proteins, runnerOutputs } = toRefs(store);

const defaultStageSettings: Record<string, RunnerComponent> = {
  [BlueLightVue.name]: BlueLightVue,
  [RedLightVue.name]: RedLightVue,
};
const defaultGUIViews: Record<string, RunnerComponent> = {
  [DrugAVue.name]: DrugAVue,
  [BlueLightSwitchVue.name]: BlueLightSwitchVue,
  [RedLightSwitchVue.name]: RedLightSwitchVue,
};

const stageSettings = computed(() => {
  const _stageSettings: Record<string, RunnerComponent> = Object.assign(
    {},
    defaultStageSettings
  );
  for (const protein of proteins.value) {
    for (const stageSetting of protein.stageSettings) {
      if (!_stageSettings[stageSetting.name]) {
        _stageSettings[stageSetting.name] = stageSetting;
      }
    }
  }
  return Object.values(_stageSettings);
});
const guiViews = computed(() => {
  const _guiViews: Record<string, RunnerComponent> = Object.assign(
    {},
    defaultGUIViews
  );
  for (const protein of proteins.value) {
    for (const guiView of protein.guiViews) {
      if (!_guiViews[guiView.name]) {
        _guiViews[guiView.name] = guiView;
      }
    }
  }
  return Object.values(_guiViews);
});

registerOutput("kill");
onUnmounted(() => {
  UnregisterOutput("kill");
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
