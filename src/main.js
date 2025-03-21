import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router/index";
import store from "@/store/index";
import vuetify from "@/plugins/vuetify";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

axios.interceptors.request.use(
  function (config) {
    if (store.getters["auth/isValidDateToken"]) {
      config.headers.Authorization = store.getters["auth/token"];
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response.headers.hasOwnProperty("authorization")) {
      store.dispatch("auth/updateToken", {
        token: response.headers.authorization,
      });
    }
    return response;
  },
  (error) => {
    if (error.response.status === 401 || error.response.status === 403) {
      store.dispatch("auth/removeToken");
      const path = error.response.data.path;
      const to = path.split(window.location.origin).pop();

      router.push({ name: "Login", params: { to: to, invalidToken: true } });
    } else {
      throw error;
    }
  }
);

const app = createApp(App);

app.use(router);
app.use(store);
app.use(vuetify);

app.mount("#app");
