import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import { createPinia } from "pinia";
import { IconDefinition, library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faStop,
  faRotateLeft,
  faTrash,
  faWaveSquare,
  faArrowsUpDownLeftRight,
  faArrowDown,
  faArrowUp,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import App from "./App.vue";
import messages, { Messages } from "./messages";

const app = createApp(App);

library.add(faPlay);
library.add(faStop);
library.add(faRotateLeft);
library.add(faTrash);
library.add(faArrowsUpDownLeftRight);
library.add(faWaveSquare);
library.add(faArrowDown);
library.add(faArrowUp);
library.add(faCaretDown);
library.add(faCaretUp);
library.add(faTwitter as IconDefinition);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());

const searchParams = new URLSearchParams(location.search);
const lang = searchParams.get("l");

const i18n = createI18n<[Messages], "en">({
  legacy: false,
  locale: lang ?? "en",
  fallbackLocale: "en",
  messages,
});
app.use(i18n);
app.mount("#app");
