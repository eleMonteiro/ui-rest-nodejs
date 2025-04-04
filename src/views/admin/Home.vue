<script setup>
import { markRaw } from "vue";
import { ref, onMounted } from "vue";
import HomeLayout from "@/components/Layout.vue";
import Dish from "@/views/admin/dish/Dish.vue";
import Profile from "@/views/admin/Profile.vue";
import User from "@/views/admin/user/User.vue";
import { useStore } from "vuex";
import router from "@/router";

const store = useStore();

const menu = ref({
  home: {
    name: "home",
    icon: "mdi mdi-home",
    component: markRaw(Profile),
  },
  food: {
    name: "food",
    icon: "mdi mdi-food-takeout-box",
    component: markRaw(Dish),
  },
  users: {
    name: "users",
    icon: "mdi mdi-account",
    component: markRaw(User),
  },
  logout: {
    name: "logout",
    icon: "mdi mdi-logout",
    action: () => {
      store.dispatch("auth/logout");
      router.push("/login");
    },
  },
});

const user = ref("");

onMounted(async () => {
  const response = await store.dispatch("auth/checkTokenValidity");
  if (response?.success) {
    user.value = store.getters["auth/user"].name;
  } else {
    store.commit("auth/CLEAR_USER");
    router.push("/login");
  }
});
</script>

<template>
  <HomeLayout :menuItems="menu" :user="user" />
</template>

<style scoped></style>
