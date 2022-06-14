import { createApp } from "vue";
import { createPinia } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faStop, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import App from "./App.vue";

const app = createApp(App);

library.add(faPlay);
library.add(faStop);
library.add(faTrash);
app.component("font-awesome-icon", FontAwesomeIcon);

app.use(createPinia());
app.mount("#app");
