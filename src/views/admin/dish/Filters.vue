<script setup>
import { ref } from "vue";
import { CATEGORY_OPTIONS } from "@/constants/category";

const emit = defineEmits(["filter"]);

const localFilter = ref({
  id: null,
  name: null,
  description: null,
  category: null,
  price: {
    op: "",
    value: null,
  },
});

const clearFilters = () => {
  const clearedFilter = {
    id: null,
    name: null,
    description: null,
    category: null,
    price: {
      op: "",
      value: null,
    },
  };
  localFilter.value = clearedFilter;
  emit("filter", clearedFilter);
};

const applyFilters = () => {
  emit("filter", localFilter.value);
};
</script>

<template>
  <div class="container">
    <v-text-field v-model="localFilter.id" label="ID" class="custom-text-field" />

    <v-text-field v-model="localFilter.name" label="Nome" class="custom-text-field" />

    <v-text-field v-model="localFilter.description" label="Descrição" class="custom-text-field" />

    <v-select
      v-model="localFilter.category"
      label="Categoria"
      :items="CATEGORY_OPTIONS"
      item-title="label"
      item-value="value"
      class="custom-text-field"
    />

    <v-select
      v-model="localFilter.price.op"
      :items="[
        { value: '', title: '=' },
        { value: 'lt', title: '<' },
        { value: 'le', title: '<=' },
        { value: 'gt', title: '>' },
        { value: 'ge', title: '>=' },
      ]"
      label="Op."
      class="custom-text-field"
      style="max-width: 100px"
    />

    <v-text-field
      v-model="localFilter.price.value"
      label="Preço"
      class="custom-text-field"
      type="number"
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

  height: 20%;
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
