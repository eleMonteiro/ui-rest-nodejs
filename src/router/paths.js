const routes = [
  {
    path: "/:catchAll(.*)",
    name: "not-found",
    component: () => import("@/components/ErrorPage.vue"),
    props: {
      title: "Página não encontrada",
      message: "A página que você tentou acessar não existe.",
      icon: "mdi-alert-octagon",
    },
  },
  {
    path: "/error",
    name: "error",
    component: () => import("@/components/ErrorPage.vue"),
    props: {
      title: "Erro interno do servidor",
      message: "Algo deu errado ao processar sua solicitação.",
      icon: "mdi-alert-circle",
    },
  },
  {
    path: "/not-authorized",
    name: "not-authorized",
    component: () => import("@/components/ErrorPage.vue"),
    props: {
      title: "Acesso negado",
      message: "Você não tem permissão para acessar esta página.",
      icon: "mdi-lock",
    },
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
  {
    path: "/home-client",
    name: "home-client",
    component: () => import("@/views/client/Home.vue"),
    meta: {
      requiresAuth: true,
      profile: "CLIENTE",
    },
  },
];

export default routes;
