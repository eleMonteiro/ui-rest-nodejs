import { createRouter, createWebHistory } from "vue-router";
import paths from "@/router/paths";
import store from "@/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: paths,
});

router.afterEach((to) => {
  const title = to.meta.title || "Meu App";
  document.title = title;
});

router.beforeEach(async (to, from, next) => {
  const response = await store.dispatch("auth/checkTokenValidity");
  const role = store.getters["auth/roleUser"];
  const requiredProfile = to.meta.profile;

  const isAuthenticated = response?.status === 200;
  const isLoginPage = to.path === "/login";

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      if (!isLoginPage) {
        next("/login");
      } else {
        next();
      }
      return;
    }

    if (requiredProfile && role !== requiredProfile) {
      next("/not-authorized");
      return;
    }
  }

  if (isAuthenticated && isLoginPage) {
    if (role === "CLIENTE") {
      next("/home-client");
      return;
    }

    if (role === "ADMIN") {
      next("/home");
      return;
    }
  }

  next();
});

router.onError((_error) => {
  router.replace({ name: "error" });
});

export default router;
