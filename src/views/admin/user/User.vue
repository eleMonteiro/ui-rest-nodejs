<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import Table from "@/views/admin/user/Table.vue";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import Form from "@/views/admin/user/Form.vue";
import { filterFIQL } from "@/utils/fiql";

const store = useStore();

const DEFAULT_RECORD = {
  id: null,
  name: "",
  cpf: "",
  dateOfBirth: "",
  password: "",
  email: "",
  role: "",
};

const itens = ref([]);
const record = ref(DEFAULT_RECORD);
const dialogForm = ref(false);
const isEditing = ref(false);
const dialogDelete = ref(false);
const valid = ref(true);

const recordId = ref(null);

const headers = [
  { title: "ID", key: "id", align: "center" },
  { title: "Nome", key: "name", align: "center" },
  { title: "CPF", key: "cpf", align: "center" },
  { title: "Data de Nascimento", key: "dateOfBirth", align: "center" },
  { title: "Email", key: "email", align: "center" },
  { title: "", key: "actions", sortable: false, align: "center" },
];

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
  },
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
  fetchUsers();
};

const fetchUsers = async () => {
  try {
    const response = await store.dispatch("user/getUsers", {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      sort: pagination.value.sort,
      filter: filterFIQL(pagination.value.filter),
    });

    if (response?.success) {
      itens.value = store.getters["user/users"];
      pagination.value = store.getters["user/pagination"];
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
  record.value = DEFAULT_RECORD;
  dialogForm.value = true;
};

const edit = (id) => {
  isEditing.value = true;
  store.dispatch("user/getUser", id).then(() => {
    record.value = { ...store.getters["user/user"] };
    dialogForm.value = true;
  });
};

const del = (id) => {
  recordId.value = id;
  dialogDelete.value = true;
};

const remove = async () => {
  try {
    const response = await store.dispatch("user/deleteUser", recordId.value);
    dialogDelete.value = false;
    if (response?.success) {
      showMessage(response);
    } else {
      showMessage(response);
    }
    fetchUsers();
  } catch (error) {
    dialogDelete.value = false;
    showMessage(error);
  }
};

const save = async (newRecord) => {
  try {
    if (valid.value) {
      if (isEditing.value) {
        const response = await store.dispatch("user/updateUser", newRecord);
        if (response?.success) {
          showMessage(response);
        } else {
          showMessage(response);
        }
        reset();
      } else {
        const response = await store.dispatch("user/createUser", newRecord);
        if (response?.success) {
          showMessage(response);
        } else {
          showMessage(response);
        }
        reset();
      }
      fetchUsers();
    } else {
      store.dispatch("snackbar/showSnackbar", {
        text: "Preencha todos os campos corretamente.",
        color: "error",
      });
    }
  } catch (error) {
    showMessage(error);
  }
};

const reset = () => {
  dialogForm.value = false;
  record.value = { ...DEFAULT_RECORD };
  isEditing.value = false;
  recordId.value = null;
  valid.value = true;
};

const showMessage = (response) => {
  const message = response?.success
    ? "Operação realizada com sucesso!"
    : "Erro ao realizar operação!";

  store.dispatch("snackbar/showSnackbar", {
    text: response?.message || message,
    color: response?.success ? "success" : "error",
  });
};

const closeDialogForm = () => {
  dialogForm.value = false;
};
</script>

<template>
  <div>
    <Table
      :itens="itens"
      :headers="headers"
      :pagination="pagination"
      @add="add"
      @edit="edit"
      @delete="del"
      @reset="reset"
      @update-table="updateTable"
      @filter="updateTable"
    ></Table>

    <Form
      :dialog="dialogForm"
      :isEditing="isEditing"
      :record="record"
      @save="save"
      @close="closeDialogForm"
    ></Form>

    <ConfirmDeleteDialog
      v-model:visible="dialogDelete"
      @confirm="remove"
      @cancel="dialogDelete = false"
      text="Deseja realmente remover este usuário?"
    ></ConfirmDeleteDialog>
  </div>
</template>

<style scoped></style>
