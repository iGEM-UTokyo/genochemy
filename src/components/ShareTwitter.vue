<template>
  <IconButton @click="share" background-color="#00ACEE" color="white">
    <font-awesome-icon :icon="faTwitter" />
  </IconButton>
</template>

<script lang="ts" setup>
import { useStore } from "@/store";
import exportJsonV2 from "@/utils/exporter";
import IconButton from "./IconButton.vue";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const store = useStore();
function share() {
  const version = 2;
  const json = exportJsonV2(Object.values(store.snakes));
  const baseUrl = "https://twitter.com/intent/tweet?";
  const text = ["text", t("twitterShare")];
  const origin = location.origin.includes("localhost")
    ? "https://genochemy.netlify.app"
    : location.origin;
  const url = [
    "url",
    `${origin}/?c=${btoa(JSON.stringify(json))}&v=${version}`,
  ];
  const hashtags = ["hashtags", "genochemy"];
  const query = new URLSearchParams([text, url, hashtags]).toString();
  window.open(`${baseUrl}${query}`);
}
</script>

<style scoped></style>
