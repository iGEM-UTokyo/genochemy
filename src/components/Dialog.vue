<template>
  <div class="background" v-if="modelValue">
    <div class="dialog">
      <div class="dialog-title">
        <h1 class="title">
          {{ t(title) }}
        </h1>
        <h1 @click="close">
          <font-awesome-icon icon="close" />
        </h1>
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps<{
  modelValue: boolean;
  title: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
const close = () => {
  emit("update:modelValue", false);
};
</script>

<style scoped>
.background {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog {
  background-color: white;
  width: 80%;
  height: 80%;
  border-radius: 30px;
  padding: 20px;
  box-sizing: border-box;
  pointer-events: all;
}

.dialog-title {
  display: flex;
}
.dialog-title h1 {
  margin: 0;
}
.dialog-title .title {
  flex: 1;
}
</style>
