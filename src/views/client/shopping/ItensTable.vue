<script setup>
defineProps({
  items: Array,
});

defineEmits(["remove-item"]);

const headers = [
  { title: "ID", key: "dishId", align: "center" },
  { title: "Dish", key: "name", align: "center" },
  { title: "Quantity", key: "amount", align: "center" },
  { title: "Price", key: "price", align: "center" },
  { title: "Total Value", key: "total", align: "center" },
  { title: "", key: "actions", sortable: false, align: "center" },
];
</script>

<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :hide-default-footer="items.length < 11"
    hide-default-header
    class="table"
  >
    <template v-slot:item.total="{ item }">
      R$ {{ (item.price * item.amount).toFixed(2) }}
    </template>

    <template v-slot:item.actions="{ item }">
      <div class="d-flex ga-2 justify-end">
        <v-tooltip text="Excluir" location="top">
          <template #activator="{ props }">
            <v-icon
              color="text"
              icon="mdi-delete"
              size="small"
              @click="$emit('remove-item', item.dishId)"
              v-bind="props"
            ></v-icon>
          </template>
        </v-tooltip>
      </div>
    </template>

    <template #bottom>
      <v-toolbar class="footer-table">
        Total: R$
        {{ items.reduce((sum, i) => sum + i.price * i.amount, 0).toFixed(2) }}
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<style scoped>
.table {
  flex: 1;
  display: flex;
  background-color: transparent;
  color: var(--color-text);
}

.full-height-table {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.full-height-table::v-deep .v-data-table__wrapper {
  flex: 1;
}

.header-table,
.footer-table {
  background-color: transparent;
  color: var(--color-text);
}

.header-table {
  text-align: center;
}

.footer-table {
  text-align: center;
  font-weight: 200;
  font-size: 1.5em;
}
</style>
