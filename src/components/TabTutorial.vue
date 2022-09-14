<template>
  <div class="tab-content">
    <span
      :class="{ 'q-nav': true, disabled: tutorialNumber <= 0 }"
      @click="decrement"
      >◀</span
    >
    Tutorial {{ tutorialNumber + 1 }}
    <span
      :class="{
        'q-nav': true,
        disabled: tutorialNumber >= tutorial.length - 1,
      }"
      @click="increment"
      >▶</span
    >
    <div class="question-content">
      <img :src="currentTutorial.img" /><br />
      {{ currentTutorial.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import tutorial from "@/utils/tutorial";

const tutorialNumber = ref(0);
const currentTutorial = computed(() => tutorial[tutorialNumber.value]);
function increment() {
  if (tutorialNumber.value >= tutorial.length - 1) return;
  tutorialNumber.value++;
}
function decrement() {
  if (tutorialNumber.value <= 0) return;
  tutorialNumber.value--;
}
</script>

<style scoped>
button {
  background-color: white;
  border: 1px solid #aaa;
  padding: 10px;
  border-radius: 10px;
}
.q-nav.disabled {
  color: #ddd;
}
h2 {
  margin: 0;
}
.question-content {
  text-align: center;
}
img {
  width: 100%;
}
</style>
