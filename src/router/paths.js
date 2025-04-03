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
    path: "/not-authorized",
    name: "not-authorized",
    component: () => import("@/components/NotAuthorized.vue"),
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
    path: "/forgot",
    name: "forgot",
    component: () => import("@/views/auth/Forgot.vue"),
  },

  {
    path: "/reset",
    name: "reset",
    component: () => import("@/views/auth/Reset.vue"),
    props: (route) => ({ token: route.query.token }),
  },
  {
    path: "/home",
    name: "home-admin",
    component: () => import("@/views/admin/Home.vue"),
    meta: {
      requiresAuth: true,
      profile: "ADMIN",
    },
  },
];

export default routes;
