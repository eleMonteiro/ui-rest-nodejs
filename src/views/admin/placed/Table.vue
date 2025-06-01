<script setup>
import { ref } from "vue";
import { DEMAND_STATUS, DEMAND_DELIVERY_METHOD } from "@/constants/demand";
import { formatDate } from "@/utils/format";
import Filters from "@/views/admin/placed/Filters.vue";

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
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["edit", "reset", "update-table", "filter"]);

const filter = ref({
  id: null,
  dateOfDemand: null,
  deliveryMethod: null,
  status: null,
});

const edit = (id) => {
  emit("edit", id);
};

const view = (id) => {
  emit("view", id);
};

const reset = () => {
  emit("reset");
};

const updateTable = (options) => {
  emit("update-table", {
    ...options,
    filter: filter.value,
  });
};

const fetchFilter = (filter) => {
  filter.value = newFilter;
  emit("filter", {
    page: 1,
    itemsPerPage: props.pagination.pageSize,
    filter: newFilter,
  });
};
</script>

<template>
  <Filters @filter="fetchFilter" />
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
        <v-toolbar-title> Pedidos </v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
    </template>

    <template v-slot:item.dateOfDemand="{ item }">
      {{ formatDate(item?.dateOfDemand) }}
    </template>

    <template v-slot:item.deliveryMethod="{ item }">
      {{ DEMAND_DELIVERY_METHOD.find((option) => option.value === item.deliveryMethod)?.label }}
    </template>

    <template v-slot:item.status="{ item }">
      {{ DEMAND_STATUS.find((option) => option.value === item.status)?.label }}
    </template>

    <template v-slot:item.actions="{ item }">
      <div
        v-if="item.status !== 'ENTREGUE' && item.status !== 'CANCELADO'"
        class="d-flex ga-2 justify-end"
      >
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
      </div>
      <div v-else class="d-flex ga-2 justify-end">
        <v-tooltip text="Visualizar" location="top">
          <template #activator="{ props }">
            <v-icon
              color="text"
              icon="mdi-eye"
              size="small"
              @click="view(item.id)"
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
  height: 80%;

  background-color: transparent;
  color: var(--color-text);
}

.header-table {
  background-color: transparent;
  color: var(--color-text);
  text-align: center;
}
</style>
