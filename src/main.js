import "./assets/main.css";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const app = createApp(App);

const vuetify = createVuetify({
  ssr: true,
  components,
  directives,
});

app.use(router);
app.use(vuetify);

app.mount("#app");
