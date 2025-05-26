<script setup>
import { ref } from "vue";

const emit = defineEmits(["filter"]);

const roles = ["ADMIN", "CLIENTE"];

const localFilter = ref({
  id: null,
  name: null,
  cpf: null,
  role: null,
});

const localFilterIsValid = () => {
  const filter = localFilter.value;

  return (
    (filter.id !== null && String(filter.id).trim() !== "") ||
    (filter.name !== null && filter.name.trim() !== "") ||
    (filter.cpf !== null && filter.cpf.trim() !== "") ||
    (filter.role !== null && filter.role !== "")
  );
};

const clearFilters = () => {
  const isValidFilter = localFilterIsValid();
  const clearedFilter = {
    id: null,
    name: null,
    cpf: null,
    role: null,
  };
  localFilter.value = clearedFilter;
  if (isValidFilter) emit("filter", clearedFilter);
};

const applyFilters = () => {
  const isValidFilter = localFilterIsValid();
  if (isValidFilter) emit("filter", localFilter.value);
};
</script>

<template>
  <div class="container">
    <v-text-field v-model="localFilter.id" label="ID" class="custom-text-field" />

    <v-text-field v-model="localFilter.name" label="Nome" class="custom-text-field" />

    <v-text-field
      v-model="localFilter.cpf"
      v-mask="'###.###.###-##'"
      label="CPF"
      class="custom-text-field"
    />

    <v-select
      v-model="localFilter.role"
      label="Perfil"
      :items="roles"
      class="custom-text-field"
    />

    <v-btn
      color="secondary"
      @click="applyFilters"
      prepend-icon="mdi-magnify"
      class="custom-text-field"
    >
      Pesquisar
    </v-btn>

    <v-btn color="primary" @click="clearFilters" prepend-icon="mdi-close" class="custom-text-field">
      Limpar Filtros
    </v-btn>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.custom-text-field :deep(.v-input__control) {
  background-color: var(--color-background-input);
}

.v-card {
  background-color: var(--color-background-card);
}

.custom-text-field {
  color: var(--color-text-input);
}

.custom-text-field :deep(input) {
  background-color: var(--color-background-input);
  color: var(--color-text-input);
  border: none;
  font-size: 1em;
  font-weight: 200;
}

.custom-text-field :deep(textarea) {
  background-color: var(--color-background-input);
  color: var(--color-text-input);
  border: none;
  font-size: 1em;
  font-weight: 200;
}

.custom-text-field :deep(.v-messages__message) {
  color: var(--color-text-input);
}
</style>
