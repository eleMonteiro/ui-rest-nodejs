<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { filterFIQL } from "@/utils/fiql";
import Table from "@/views/admin/placed/Table.vue";
import useSnackbar from "@/composables/useSnackbar";

const { showMessage } = useSnackbar();

const store = useStore();

const headers = [
  { title: "ID", key: "id", align: "start" },
  { title: "Data do Pedido", key: "dateOfDemand" },
  { title: "Método de Entrega", key: "deliveryMethod" },
  { title: "Status", key: "status" },
];

const itens = ref([]);
const pagination = ref({
  total: 0,
  page: 1,
  pageSize: 5,
  totalPages: 0,
  sort: {
    field: "id",
    order: "asc",
  },
  filter: {
    id: null,
    dateOfDemand: null,
    deliveryMethod: null,
    status: null,
  },
});

const record = ref({
  id: null,
  dateOfDemand: null,
  deliveryMethod: null,
  status: null,
});

onMounted(async () => {
  reset();
});

const updateTable = (options, filter) => {
  const { page, itemsPerPage, sortBy } = options;
  pagination.value.page = page;
  pagination.value.pageSize = itemsPerPage;
  pagination.value.filter = { ...filter };
  pagination.value.sort = {
    field: sortBy && sortBy.length > 0 ? sortBy[0].key : "id",
    order: sortBy && sortBy.length > 0 ? sortBy[0].order : "asc",
  };
  fetchDemands();
};

const fetchDemands = async () => {
  try {
    const response = await store.dispatch("demand/getDemands", {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      sort: pagination.value.sort,
      filter: filterFIQL(pagination.value.filter),
    });

    if (response?.success) {
      itens.value = store.getters["demand/demands"];
      pagination.value = store.getters["demand/pagination"];
    } else {
      itens.value = [];
      showMessage(response);
    }
  } catch (error) {
    itens.value = [];
    showMessage(error);
  }
};

const reset = () => {
  record.value = {
    id: null,
    dateOfDemand: null,
    deliveryMethod: null,
    status: null,
  };
};
</script>

<template>
  <div>
    <Table
      :pagination="pagination"
      :itens="itens"
      :headers="headers"
      @reset="reset"
      @update-table="updateTable"
      @filter="updateTable"
    ></Table>
  </div>
</template>

<style scoped></style>
