<script setup>
import { markRaw } from "vue";
import { ref, onMounted } from "vue";
import HomeLayout from "@/components/Layout.vue";
import { useStore } from "vuex";
import router from "@/router";
import Placed from "@/views/client/Placed.vue";
import Food from "@/views/client/Food.vue";
import Shopping from "@/views/client/Shopping.vue";
import Profile from "@/views/Profile.vue";

const store = useStore();

const menu = ref({
  account: {
    name: "account",
    icon: "mdi mdi-account",
    component: markRaw(Profile),
  },
  placed: {
    name: "placed",
    icon: "mdi mdi-tray-full",
    component: markRaw(Placed),
  },
  food: {
    name: "food",
    icon: "mdi mdi-food",
    component: markRaw(Food),
  },
  shopping: {
    name: "shopping",
    icon: "mdi mdi-cart-outline",
    component: markRaw(Shopping),
  },
  logout: {
    name: "logout",
    icon: "mdi mdi-logout",
    action: async () => {
      await store.dispatch("auth/logout");
      router.push("/login");
    },
  },
});

const user = ref("");

onMounted(async () => {
  const response = await store.dispatch("auth/checkTokenValidity");
  if (response?.success) {
    const _user = store.getters["auth/user"];
    const _response = await store.dispatch("user/getUser", _user.userId);
    if (_response?.success) {
      user.value = store.getters["user/user"]?.name;
    } else {
      user.value = "Senhor(a)";
    }
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
