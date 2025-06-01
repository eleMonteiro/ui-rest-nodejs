<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { filterFIQL } from "@/utils/fiql";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import Table from "@/views/admin/dish/Table.vue";
import Form from "@/views/admin/dish/Form.vue";
import useSnackbar from "@/composables/useSnackbar";

const { showMessage } = useSnackbar();

const store = useStore();

const DEFAULT_RECORD = {
  name: "",
  description: "",
  category: "",
  price: "",
  image: "",
};

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
    name: null,
    description: null,
    category: null,
    price: {
      op: "eq",
      value: null,
    },
  },
});
const record = ref({ ...DEFAULT_RECORD });
const recordId = ref(null);
const valid = ref(true);

const imagePreview = ref(null);
const imageFile = ref(null);

const dialogForm = ref(false);
const isEditing = ref(false);
const dialogDelete = ref(false);

const headers = [
  { title: "ID", key: "id", align: "start" },
  { title: "Nome", key: "name", align: "start" },
  { title: "Descrição", key: "description", align: "start" },
  { title: "Categoria", key: "category", align: "start" },
  { title: "Preço", key: "price", align: "start" },
  { title: "", key: "actions", align: "center", sortable: false },
];

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

  fetchDishes();
};

const handleFilter = ({ page, itemsPerPage, filter }) => {
  pagination.value.page = page || 1;
  pagination.value.pageSize = itemsPerPage || pagination.value.pageSize;
  pagination.value.filter = filter ? { ...filter } : {};
  fetchDishes();
};

const fetchDishes = async () => {
  try {
    const response = await store.dispatch("dish/getDishes", {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      sort: pagination.value.sort,
      filter: filterFIQL(pagination.value.filter),
    });

    if (response?.success) {
      itens.value = store.getters["dish/dishes"];
      pagination.value = store.getters["dish/pagination"];
    } else {
      itens.value = [];
      showMessage(response);
    }
  } catch (error) {
    itens.value = [];
    showMessage(error);
  }
};

const add = () => {
  isEditing.value = false;
  record.value = { ...DEFAULT_RECORD };
  imagePreview.value = null;
  imageFile.value = null;
  dialogForm.value = true;
};

const edit = (id) => {
  isEditing.value = true;
  imagePreview.value = null;
  imageFile.value = null;
  store.dispatch("dish/getDish", id).then(() => {
    record.value = { ...store.getters["dish/dish"] };
    imagePreview.value = record.value.image ? record.value.image : null;
    imageFile.value = null;
    dialogForm.value = true;
  });
};

const del = (id) => {
  recordId.value = id;
  dialogDelete.value = true;
};

const deleteItem = async () => {
  try {
    const response = await store.dispatch("dish/deleteDish", recordId.value);
    if (response?.success) {
      showMessage(response);
      dialogDelete.value = false;
      fetchDishes();
    } else {
      showMessage(response);
    }
  } catch (error) {
    showMessage(error);
  }
};

const save = async () => {
  try {
    if (valid.value) {
      if (imageFile.value) {
        record.value.image = imageFile.value;
      } else if (!imagePreview.value) {
        record.value.image = "";
      }

      if (isEditing.value) {
        const response = await store.dispatch("dish/updateDish", record.value);
        if (response?.success) {
          showMessage(response);
          reset();
          fetchDishes();
        } else {
          showMessage(response);
        }
      } else {
        const response = await store.dispatch("dish/createDish", record.value);
        if (response?.success) {
          showMessage(response);
          reset();
          fetchDishes();
        } else {
          showMessage(response);
        }
      }
    } else {
      showMessage({
        success: false,
        message: "Preencha todos os campos corretamente.",
      });
    }
  } catch (error) {
    showMessage(error);
  }
};

const closeDialogForm = () => {
  dialogForm.value = false;
};

const reset = () => {
  dialogForm.value = false;
  record.value = { ...DEFAULT_RECORD };
  isEditing.value = false;
  imagePreview.value = null;
  imageFile.value = null;
  recordId.value = null;
  valid.value = true;
};

const handleClearPreview = () => {
  imagePreview.value = null;
  imageFile.value = null;
  record.value.image = "";
};
</script>

<template>
  <div>
    <Table
      :pagination="pagination"
      :itens="itens"
      :headers="headers"
      @add="add"
      @edit="edit"
      @delete="del"
      @reset="reset"
      @update-table="handleUpdateTable"
      @filter="handleFilter"
    ></Table>

    <Form
      :dialog="dialogForm"
      :isEditing="isEditing"
      :record="record"
      :imagePreview="imagePreview"
      @update:imageFile="(file) => (imageFile = file)"
      @save="save"
      @close="closeDialogForm"
      @clear-preview="handleClearPreview"
    ></Form>

    <ConfirmDeleteDialog
      v-model:visible="dialogDelete"
      @confirm="deleteItem"
      @cancel="dialogDelete = false"
      text="Deseja realmente remover este prato?"
    ></ConfirmDeleteDialog>
  </div>
</template>

<style scoped></style>
