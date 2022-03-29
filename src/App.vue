<template>
  <main>
    <Tray />
    <Program />
  </main>
</template>

<script setup lang="ts">
import Tray from './components/Tray.vue'
import Program from './components/Program.vue'
</script>

<style scoped>
main {
  height: 100%;
}
</style>
