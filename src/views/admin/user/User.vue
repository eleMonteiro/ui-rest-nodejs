<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import Table from "@/views/admin/user/Table.vue";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import Form from "@/views/admin/user/Form.vue";
import { filterFIQL } from "@/utils/fiql";
import useSnackbar from "@/composables/useSnackbar";
import { computed } from "vue";

const { showMessage } = useSnackbar();

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
const userLogado = computed(() => store.getters["auth/user"]);
const userLogadoId = computed(() => userLogado.value?.userId);

const headers = [
  { title: "ID", key: "id", align: "start" },
  { title: "Nome", key: "name", align: "start" },
  { title: "CPF", key: "cpf", align: "start" },
  { title: "Data de Nascimento", key: "dateOfBirth", align: "start" },
  { title: "Email", key: "email", align: "start" },
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

  fetchUsers();
};

const handleFilter = ({ page, itemsPerPage, filter }) => {
  pagination.value.page = page || 1;
  pagination.value.pageSize = itemsPerPage || pagination.value.pageSize;
  pagination.value.filter = filter ? { ...filter } : {};
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
      :user-logado-id="userLogadoId"
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
