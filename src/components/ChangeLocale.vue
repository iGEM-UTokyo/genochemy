<template>
  <select v-model="locale">
    <option value="en">English</option>
    <option value="ja">日本語</option>
  </select>
</template>

<style scoped>
select {
  pointer-events: all;
}
</style>

<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const locale = computed({
  get() {
    return i18n.locale.value;
  },
  set(newLocale: string) {
    i18n.locale.value = newLocale;
    const url = new URL(location.href);
    url.searchParams.set("l", newLocale);
    history.pushState({}, "", url);
  },
});
</script>
