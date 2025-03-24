const routes = [
  {
    path: "/:catchAll(.*)",
    name: "not-found",
    component: () => import("@/components/Error404.vue"),
  },
  {
    path: "/error",
    name: "error",
    component: () => import("@/components/Error500.vue"),
  },
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/account",
    name: "account",
    component: () => import("@/views/Account.vue"),
  },
  {
    path: "/home",
    name: "home-admin",
    component: () => import("@/views/admin/Home.vue"),
    meta: { requiresAuth: true },
  },
];

export default routes;
