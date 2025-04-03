<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const show = computed({
  get: () => store.getters["snackbar/isSnackbarVisible"],
  set: (value) => {
    if (!value) {
      store.commit("snackbar/HIDE_MESSAGE");
    }
  },
});

const text = computed(() => store.getters["snackbar/snackbarText"]);
const color = computed(() => store.getters["snackbar/snackbarColor"]);
</script>

<template>
  <v-snackbar v-model="show" :color="color" :timeout="3000" location="top">
    {{ text }}
    <template v-slot:actions>
      <v-btn variant="text" @click="show = false"> Fechar </v-btn>
    </template>
  </v-snackbar>
</template>
