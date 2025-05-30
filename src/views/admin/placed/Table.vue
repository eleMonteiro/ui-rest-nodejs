<script setup>
import { ref } from "vue";
import { DEMAND_STATUS, DEMAND_DELIVERY_METHOD } from "@/constants/demand";
import { formatMoney, formatDate } from "@/utils/format";
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

const emit = defineEmits(["reset", "update-table", "filter"]);

const filter = ref({
  id: null,
  dateOfDemand: null,
  deliveryMethod: null,
  status: null,
});

const reset = () => {
  emit("reset");
};

const updateTable = (options) => {
  emit("update-table", options, filter);
};

const fetchFilter = (filter) => {
  emit("filter", props.pagination, filter);
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
      <v-select
        chips
        v-model="item.status"
        :items="DEMAND_STATUS"
        :model-value="item.status"
        item-title="label"
        item-value="value"
      ></v-select>
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
  height: 90%;

  background-color: transparent;
  color: var(--color-text);
}

.header-table {
  background-color: transparent;
  color: var(--color-text);
  text-align: center;
}
</style>
