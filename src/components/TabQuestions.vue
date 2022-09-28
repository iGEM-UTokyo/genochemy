<template>
  <div class="tab-content">
    <span
      :class="{ 'q-nav': true, disabled: questionNumber <= 0 }"
      @click="decrement"
      >◀</span
    >
    {{ t("questions.question") }} {{ questionNumber + 1 }}
    <span
      :class="{
        'q-nav': true,
        disabled: questionNumber >= questions.length - 1,
      }"
      @click="increment"
      >▶</span
    >
    <h2>{{ t(currentQuestion.name) }}</h2>
    <div class="question-content">
      <img :src="currentImage" /><br />
      <p v-if="currentQuestion.imgs.length > 1">
        <span
          :class="{ 'q-nav': true, disabled: imageNumber <= 0 }"
          @click="decrementImage"
          >◀</span
        >
        {{ t("questions.image") }} {{ imageNumber + 1 }}
        <span
          :class="{
            'q-nav': true,
            disabled: imageNumber >= currentQuestion.imgs.length - 1,
          }"
          @click="incrementImage"
          >▶</span
        >
      </p>
      <button @click="showAnswer" v-if="currentQuestion.answer">
        {{ t("questions.showAnswer") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import questions from "@/utils/questions";
import { useStore } from "@/store";
import importJson from "@/utils/importer";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { addSnake } = useStore();

const questionNumber = ref(0);
const currentQuestion = computed(() => questions[questionNumber.value]);
const imageNumber = ref(0);
const currentImage = computed(
  () => `/questions/${currentQuestion.value.imgs[imageNumber.value]}`
);
function increment() {
  if (questionNumber.value >= questions.length - 1) return;
  questionNumber.value++;
  imageNumber.value = 0;
}
function decrement() {
  if (questionNumber.value <= 0) return;
  questionNumber.value--;
  imageNumber.value = 0;
}
function incrementImage() {
  if (imageNumber.value >= currentQuestion.value.imgs.length - 1) return;
  imageNumber.value++;
}
function decrementImage() {
  if (imageNumber.value <= 0) return;
  imageNumber.value--;
}
function showAnswer() {
  if (currentQuestion.value.answer) {
    addSnake(...importJson(currentQuestion.value.answer, 1));
  }
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
  font-family: inherit;
}
.q-nav {
  user-select: none;
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
</style>
