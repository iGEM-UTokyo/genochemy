<template>
  <IconButton @click="share" background-color="#00ACEE" color="white">
    <font-awesome-icon :icon="faTwitter" />
  </IconButton>
</template>

<script lang="ts" setup>
import { useStore } from "@/store";
import exportJson from "@/utils/exporter";
import IconButton from "./IconButton.vue";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

const store = useStore();
function share() {
  const json = exportJson(Object.values(store.snakes));
  const baseUrl = "https://twitter.com/intent/tweet?";
  const text = ["text", "Genochemy で遺伝子回路を作りました！"];
  const origin = location.origin.includes("localhost")
    ? "https://genochemy.netlify.app"
    : location.origin;
  const url = ["url", `${origin}/?c=${btoa(JSON.stringify(json))}`];
  const hashtags = ["hashtags", "genochemy"];
  const query = new URLSearchParams([text, url, hashtags]).toString();
  window.open(`${baseUrl}${query}`);
}
</script>

<style scoped></style>
