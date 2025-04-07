<script setup>
import Snackbar from "@/components/Snackbar.vue";
</script>

<template>
  <v-app theme="myTheme" color="primary" dark dense app>
    <v-main>
      <router-view />
      <Snackbar />
    </v-main>
  </v-app>
</template>

<style scoped>
.v-main {
  background-color: var(--color-accent);
  min-height: 100vh;
}
</style>
