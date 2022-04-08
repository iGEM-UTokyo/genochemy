<template>
  <main>
    <Tray />
    <Program />
    <div class="right">
      <Runner />
      <Property />
    </div>
  </main>
</template>

<script setup lang="ts">
import Tray from './components/Tray.vue'
import Program from './components/Program.vue'
import Runner from '@/components/Runner.vue'
import Property from '@/components/Property.vue'
</script>

<style scoped>
main {
  height: 100%;
  display: flex;
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
