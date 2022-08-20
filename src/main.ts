import { createApp } from "vue";
import { createPinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faStop,
  faRotateLeft,
  faTrash,
  faWaveSquare,
  faArrowsUpDownLeftRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import App from "./App.vue";

const app = createApp(App);

library.add(faPlay);
library.add(faStop);
library.add(faRotateLeft);
library.add(faTrash);
library.add(faArrowsUpDownLeftRight);
library.add(faWaveSquare);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());
app.mount("#app");
