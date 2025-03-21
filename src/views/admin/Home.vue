<script setup>
import { ref } from 'vue';
import HomeLayout from '@/components/Layout.vue';
import Dish from '@/views/admin/Dish.vue';
import Profile from '@/views/admin/Profile.vue';
import User from '@/views/admin/User.vue';

const menu = ref({
  'home': {
    name: 'home',
    icon: 'mdi mdi-home',
    component: Profile,
  },
  'food': {
    name: 'food',
    icon: 'mdi mdi-food-takeout-box',
    component: Dish,
  },
  'users': {
    name: 'users',
    icon: 'mdi mdi-account',
    component: User,
  },
});

const user = ref('Elenilson');

</script>

<template>
  <HomeLayout :menuItems="menu" :user="user" />
</template>

<style scoped></style>
