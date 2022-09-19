<template>
  <main class="app">
    <div class="left">
      <Program />
      <Tray />
    </div>
    <div :class="{ right: true, show: showRight }">
      <div class="toggle-right" @click="toggle">
        <font-awesome-icon :icon="showRight ? 'arrow-down' : 'arrow-up'" />
        {{ showRight ? t("view.hide") : t("view.show") }}
      </div>
      <Runner v-if="showRight" />
      <Property v-if="showRight" />
    </div>
  </main>
</template>

<script setup lang="ts">
import Tray from "./components/Tray.vue";
import Program from "./components/Program.vue";
import Runner from "@/components/Runner.vue";
import Property from "@/components/Property.vue";
import { onMounted, ref } from "vue";
import importJson from "./utils/importer";
import { useStore } from "./store";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const store = useStore();

const showRight = ref(true);

function toggle() {
  showRight.value = !showRight.value;
}

onMounted(() => {
  try {
    const searchParams = new URLSearchParams(location.search);
    const circuit = searchParams.get("c");
    if (circuit) {
      console.log(circuit);
      const version = searchParams.get("v") ?? "1";
      const snakes = importJson(JSON.parse(atob(circuit)), parseInt(version));
      store.addSnake(...snakes);
    }
  } catch (e) {
    console.error(e);
  }
});
</script>

<style scoped>
main {
  height: 100%;
  display: flex;
  font-family: "Zen Maru Gothic", sans-serif;
  touch-action: none;
}
.left {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.right {
  width: 0px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  user-select: none;
}
.toggle-right {
  position: absolute;
  top: 0;
  width: 100px;
  text-align: center;
  border: 1px solid #aaa;
  transform-origin: bottom right;
  transform: translate(-100%, -100%) rotate(-90deg);
  white-space: no-wrap;
  background-color: white;
}
.properties {
  flex: 1;
  margin: auto;
}
.right.show {
  width: 500px;
}
</style>
