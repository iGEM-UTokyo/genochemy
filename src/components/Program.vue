<template>
  <div class="program">
    <Snake v-for="snake in snakes" :key="snake.uuid" :snake="snake" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from "../store";
import Snake from "@/components/Snake.vue";

const { snakes } = useStore();
</script>

<style scoped>
.program {
  flex: 1;
}
</style>
