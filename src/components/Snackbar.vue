<script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  timeout: { type: Number, default: 3000 },
  location: {
    type: String,
    default: "top",
    validator: (value) => ["top", "bottom", "left", "right"].includes(value),
  },
  closeable: { type: Boolean, default: true },
});

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
  <v-snackbar v-model="show" :color="color" :timeout="timeout" :location="location">
    {{ text }}

    <template v-if="closeable" v-slot:actions>
      <v-btn variant="text" @click="show = false"> Fechar </v-btn>
    </template>

    <slot name="custom-actions"></slot>
  </v-snackbar>
</template>
