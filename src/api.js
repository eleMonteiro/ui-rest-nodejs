import axios from "axios";
import store from "@/store";
import router from "@/router";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        const path = error.response.data.path || "/";
        store.commit("auth/CLEAR_USER");
        router.push({ name: "Login", params: { to: path, invalidToken: true } });
      } else if (error.response.status === 500) {
        router.push({ name: "ServerError" });
      }
    } else {
      router.push({ name: "NetworkError" });
    }
    return Promise.reject(error);
  }
);

export default api;
