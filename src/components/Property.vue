<template>
  <div class="tabs-container">
    <tabs :tabs="tabItems" v-model="activeTab">
      <div class="tab-button" @click="run">
        <font-awesome-icon :icon="store.isRunning ? 'rotate-left' : 'play'" />
        {{ !store.isRunning ? t("view.run") : "" }}
      </div>
      <div class="tab-button" @click="stop" v-if="store.isRunning">
        <font-awesome-icon icon="stop" />
        {{ t("view.stop") }}
      </div>
    </tabs>
    <div class="tab">
      <tab-tutorial v-show="activeTab === 'tabs.tutorial'" />
      <tab-messenger-r-n-a v-if="activeTab === 'tabs.rna'" />
      <tab-protein v-if="activeTab === 'tabs.protein'" />
      <tab-questions v-show="activeTab === 'tabs.questions'" />
      <tab-load v-if="activeTab === 'tabs.load'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "@/store";
import Tabs from "@/components/Tabs.vue";
import TabTutorial from "@/components/TabTutorial.vue";
import TabMessengerRNA from "@/components/TabMessengerRNA.vue";
import TabProtein from "@/components/TabProtein.vue";
import TabQuestions from "@/components/TabQuestions.vue";
import TabLoad from "@/components/TabLoad.vue";
import { MessagesAddresses } from "@/messages";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
const { run, stop } = store;
const activeTab = ref<MessagesAddresses>("tabs.tutorial");
const tabItems: MessagesAddresses[] = [
  "tabs.tutorial",
  "tabs.protein",
  "tabs.rna",
  "tabs.questions",
  "tabs.load",
];
</script>

<style scoped>
.tabs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.tab-button {
  padding: 5px 10px;
}

.tab {
  flex: 1;
  display: flex;
  border-left: 1px solid #aaa;
  padding: 0 10px;
  align-items: stretch;
  overflow: hidden;
}
.tab-content {
  flex: 1;
  padding: 10px 0;
  overflow-y: auto;
}
</style>
