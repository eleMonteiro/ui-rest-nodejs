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
</script>

<template>
  <v-data-table
    :headers="headers"
    :hide-default-footer="!itens || itens?.length < 11"
    :items="itens"
    class="table"
  >
    <template v-slot:top>
      <v-toolbar class="header-table">
        <v-toolbar-title> Endereços </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon="mdi-plus" color="primary"></v-btn>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex ga-2 justify-end">
        <v-icon color="primary" icon="mdi-pencil" size="small"></v-icon>

        <v-icon color="primary" icon="mdi-delete" size="small"></v-icon>
      </div>
    </template>

    <template v-slot:no-data>
      <v-btn
        prepend-icon="mdi-backup-restore"
        rounded="lg"
        text="Reset data"
        variant="text"
      ></v-btn>
    </template>
  </v-data-table>
</template>

<style scoped>
.table {
  width: 100%;
  height: 200px;
  color: var(--color-primary);
}

.header-table {
  color: var(--color-primary);
  text-align: left;
}
</style>
