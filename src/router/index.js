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
    const isValid = await store.dispatch("auth/checkTokenValidity");
    if (!isValid && to.path !== "/login") {
      next("/login");
      return;
    }
  }
  next();
});

export default router;
