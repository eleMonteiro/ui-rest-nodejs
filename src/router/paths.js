const routes = [
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
    meta: { requiresAuth: true },
  },
  {
    path: "/home",
    name: "home-admin",
    component: () => import("@/views/admin/Home.vue"),
    meta: { requiresAuth: true },
  },
];

export default routes;
