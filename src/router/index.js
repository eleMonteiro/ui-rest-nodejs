import { createRouter, createWebHistory } from "vue-router";
import paths from "@/router/paths";
import store from "@/store";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: paths,
});

router.afterEach((to, from) => {});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const response = await store.dispatch("auth/checkTokenValidity");
    const role = store.getters["auth/roleUser"];
    const requiredProfile = to.meta.profile;

    if (!response?.status || response?.status !== 200) {
      if (to.path !== "/login") {
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

  next();
});

router.onError((_error) => {
  router.replace({ name: "error" });
});

export default router;
