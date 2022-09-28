<template>
  <div class="tab-content">
    <span
      :class="{ 'q-nav': true, disabled: tutorialNumber <= 0 }"
      @click="decrement"
      >◀</span
    >
    {{ t("tutorial.tutorial") }} {{ tutorialNumber + 1 }}
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
      <p v-text="t(currentTutorial.text)"></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import tutorial from "@/utils/tutorial";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
.tab-content {
  user-select: text;
}
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
  margin: 0 10px;
}
img {
  width: 100%;
}
p {
  white-space: pre-wrap;
}
</style>
