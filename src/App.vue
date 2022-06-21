<template>
  <main>
    <div class="left">
      <Program />
      <Tray />
    </div>
    <div class="right">
      <Runner />
      <Property />
    </div>
  </main>
</template>

<script setup lang="ts">
import Tray from "./components/Tray.vue";
import Program from "./components/Program.vue";
import Runner from "@/components/Runner.vue";
import Property from "@/components/Property.vue";
</script>

<style scoped>
main {
  height: 100%;
  display: flex;
  font-family: "Zen Maru Gothic", sans-serif;
}
.left {
  width: calc(100vw - 500px);
  display: flex;
  flex-direction: column;
}
.right {
  width: 500px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.properties {
  flex: 1;
  margin: auto;
}
</style>
