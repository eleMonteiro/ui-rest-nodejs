<script setup>
import { ref } from "vue";

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
  itens: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["add", "edit", "delete", "reset"]);

const CATEGORY_OPTIONS = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "PRATO_PRINCIPAL", label: "Prato Principal" },
  { value: "SOBREMESA", label: "Sobremesa" },
  { value: "BEBIDA", label: "Bebida" },
  { value: "LANCHES", label: "Lanches" },
  { value: "PETISCOS", label: "Petiscos" },
];

const add = () => {
  emit("add");
};

const edit = (id) => {
  emit("edit", id);
};

const del = (id) => {
  emit("delete", id);
};

const reset = () => {
  emit("reset");
};

const updateTable = (options) => {
  emit("update-table", options);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
</script>

<template>
  <v-data-table-server
    :headers="headers"
    :items="itens"
    :items-length="pagination.total"
    :loading="loading"
    :items-per-page-options="[5, 10, 25, 50]"
    :items-per-page-text="'Itens por página'"
    @update:options="updateTable"
    class="table"
  >
    <template v-slot:top>
      <v-toolbar class="header-table">
        <v-toolbar-title> Pratos </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon="mdi-plus" @click="add" color="text"></v-btn>
      </v-toolbar>
    </template>

    <template v-slot:item.price="{ item }">
      {{ formatCurrency(item.price) }}
    </template>

    <template v-slot:item.category="{ item }">
      {{ CATEGORY_OPTIONS.find((option) => option.value === item.category)?.label }}
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex ga-2 justify-end">
        <v-tooltip text="Editar" location="top">
          <template #activator="{ props }">
            <v-icon
              color="text"
              icon="mdi-pencil"
              size="small"
              @click="edit(item.id)"
              v-bind="props"
            ></v-icon>
          </template>
        </v-tooltip>
        <v-tooltip text="Excluir" location="top">
          <template #activator="{ props }">
            <v-icon
              color="text"
              icon="mdi-delete"
              size="small"
              @click="del(item.id)"
              v-bind="props"
            ></v-icon>
          </template>
        </v-tooltip>
      </div>
    </template>

    <template v-slot:no-data>
      <v-btn
        prepend-icon="mdi-backup-restore"
        rounded="lg"
        text="Reset data"
        variant="text"
        @click="reset"
      ></v-btn>
    </template>
  </v-data-table-server>
</template>

<style scoped>
.table {
  width: 100%;
  height: 100%;

  background-color: transparent;
  color: var(--color-text);
}

.header-table {
  background-color: transparent;
  color: var(--color-text);
  text-align: center;
}
</style>
