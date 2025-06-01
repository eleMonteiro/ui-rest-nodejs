<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { filterFIQL } from "@/utils/fiql";
import Table from "@/views/admin/placed/Table.vue";
import Form from "@/views/admin/placed/Form.vue";
import useSnackbar from "@/composables/useSnackbar";

const { showMessage } = useSnackbar();

const store = useStore();

const headers = [
  { title: "ID", key: "id", align: "start", sortable: true },
  { title: "Data do Pedido", key: "dateOfDemand", align: "start", sortable: true },
  { title: "Método de Entrega", key: "deliveryMethod", align: "start", sortable: true },
  { title: "Status", key: "status", align: "start", sortable: false },
  { title: "", key: "actions", align: "center", sortable: false },
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
  userId: null,
  address: null,
});
const dialogForm = ref(false);
const isEditing = ref(false);

onMounted(async () => {
  reset();
});

const handleUpdateTable = ({ page, itemsPerPage, sortBy, filter }) => {
  pagination.value.page = page;
  pagination.value.pageSize = itemsPerPage;
  pagination.value.filter = filter ? { ...filter } : {};

  if (sortBy && sortBy.length > 0) {
    pagination.value.sort = {
      field: sortBy[0].key,
      order: sortBy[0].order,
    };
  }

  fetchDemands();
};

const handleFilter = ({ page, itemsPerPage, filter }) => {
  pagination.value.page = page || 1;
  pagination.value.pageSize = itemsPerPage || pagination.value.pageSize;
  pagination.value.filter = filter ? { ...filter } : {};
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

const edit = async (id) => {
  try {
    const response = await store.dispatch("demand/getDemand", id);
    if (response?.success) {
      record.value = { ...store.getters["demand/demand"] };
      dialogForm.value = true;
      isEditing.value = true;
    } else {
      showMessage(response);
    }
  } catch (error) {
    showMessage(error);
  }
};

const view = async (id) => {
  try {
    const response = await store.dispatch("demand/getDemand", id);
    if (response?.success) {
      record.value = { ...store.getters["demand/demand"] };
      dialogForm.value = true;
      isEditing.value = false;
    } else {
      showMessage(response);
    }
  } catch (error) {
    showMessage(error);
  }
};

const editDemand = async () => {
  try {
    const response = await store.dispatch("demand/updateDemand", record.value);
    if (response?.success) {
      showMessage(response);
      dialogForm.value = false;
      fetchDemands();
    } else {
      showMessage(response);
    }
  } catch (error) {
    showMessage(error);
  }
};

const closeDialogForm = () => {
  dialogForm.value = false;
};

const reset = () => {
  record.value = {
    id: null,
    dateOfDemand: null,
    deliveryMethod: null,
    status: null,
  };
  dialogForm.value = false;
  isEditing.value = false;
};
</script>

<template>
  <div>
    <Table
      :pagination="pagination"
      :itens="itens"
      :headers="headers"
      @edit="edit"
      @view="view"
      @reset="reset"
      @update-table="handleUpdateTable"
      @filter="handleFilter"
    ></Table>

    <Form
      :isEditing="isEditing"
      :dialog="dialogForm"
      :record="record"
      @edit="editDemand"
      @close="closeDialogForm"
    ></Form>
  </div>
</template>

<style scoped></style>
