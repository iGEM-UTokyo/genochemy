import { createApp } from "vue";
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
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import App from "./App.vue";

const app = createApp(App);

library.add(faPlay);
library.add(faStop);
library.add(faRotateLeft);
library.add(faTrash);
library.add(faArrowsUpDownLeftRight);
library.add(faWaveSquare);
library.add(faArrowDown);
library.add(faArrowUp);
library.add(faTwitter as IconDefinition);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());
app.mount("#app");
