import { createRouter, createWebHistory } from "vue-router";
import paths from "./paths";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "active",
  routes: paths,
});

router.afterEach((to, from) => {});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!localStorage.getItem("token")) {
      next("/login");
      return;
    }
  }
  next();
});

export default router;
