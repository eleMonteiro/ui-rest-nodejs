<script setup>
import { ref, onMounted } from 'vue';
import api from './services/api';

const data = ref(null);

onMounted(async () => {
  try {
    const response = await api.get('/endpoint');
    data.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar dados', error);
  }
});
</script>

<template>
  <div>
    <h1>Dados do Servidor</h1>
    <pre>{{ data }}</pre>
  </div>
</template>
