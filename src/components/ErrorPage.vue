<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, default: "Ocorreu um erro inesperado." },
  showHomeButton: { type: Boolean, default: true },
  icon: { type: String, default: "mdi-alert-circle" },
});
</script>

<template>
  <div class="error-page">
    <v-icon :icon="icon" size="64" color="error"></v-icon>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>

    <slot name="additional-content"></slot>

    <v-btn v-if="showHomeButton" color="primary" class="mt-4" to="/">
      Voltar para a página inicial
    </v-btn>
  </div>
</template>

<style scoped>
.error-page {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
}
</style>
