<template>
  <div class="runner">
    <div class="stage-settings">
      <component
        v-for="(setting, index) of stageSettings"
        :key="index"
        :is="setting"
      />
    </div>
    <img src="/runner/bacterium.svg" class="bacterium" />
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
import { computed, toRefs } from "vue";
import { useStore } from "../store";

const store = useStore();
const { proteins } = toRefs(store);

const stageSettings = computed(() =>
  proteins.value.map((protein) => protein.stageSettings).flat()
);
const guiViews = computed(() =>
  proteins.value.map((protein) => protein.guiViews).flat()
);
</script>

<style scoped>
.runner {
  height: 300px;
  border: 1px solid #aaa;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.bacterium {
  height: 200px;
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
