<script setup>
import { ref } from "vue";

const props = defineProps({
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
</script>

<template>
  <v-data-table
    :headers="headers"
    :hide-default-footer="itens.length < 11"
    :items="itens"
    class="table"
  >
    <template #top>
      <v-toolbar class="header-table">
        <v-toolbar-title> Usuários </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon="mdi-plus" @click="add"></v-btn>
      </v-toolbar>
    </template>

    <template #item.cpf="{ item }">
      {{ item.cpf }}
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex ga-2 justify-end">
        <v-tooltip text="Editar" location="top">
          <template #activator="{ props }">
            <v-icon
              color="white"
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
              color="white"
              icon="mdi-delete"
              size="small"
              @click="del(item.id)"
              v-bind="props"
            ></v-icon>
          </template>
        </v-tooltip>
      </div>
    </template>

    <template #no-data>
      <v-btn
        prepend-icon="mdi-backup-restore"
        rounded="lg"
        text="Reset data"
        variant="text"
        @click="reset"
      ></v-btn>
    </template>
  </v-data-table>
</template>

<style scoped>
.table {
  width: 100%;
  height: 100%;

  background-color: transparent;
  color: var(--white);
}

.header-table {
  background-color: transparent;
  color: var(--white);
  text-align: center;
}
</style>
