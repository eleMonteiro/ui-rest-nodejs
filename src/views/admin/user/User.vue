<script setup>
import { onMounted, ref, shallowRef, computed } from "vue";
import { useStore } from "vuex";
import Table from "./Table.vue";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import Form from "./Form.vue";

const store = useStore();

const DEFAULT_RECORD = {
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

const typeAlert = ref("success");
const messageAlert = ref("");
const titleAlert = ref("");
const showAlert = ref(false);

const headers = [
  { title: "ID", key: "id", align: "center" },
  { title: "Nome", key: "name", align: "center" },
  { title: "CPF", key: "cpf", align: "center" },
  { title: "Data de Nascimento", key: "dateOfBirth", align: "center" },
  { title: "Email", key: "email", align: "center" },
  { title: "", key: "actions", sortable: false, align: "center" },
];

onMounted(async () => {
  reset();
  fetchUsers();
});

const fetchUsers = async () => {
  await store.dispatch("user/getUsers");
  itens.value = store.getters["user/users"];
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
    await store.dispatch("user/deleteUser", recordId.value);
    dialogDelete.value = false;
    fetchUsers();
  } catch (error) {
    showAlertMessage("error", error.message, error.error);
  }
};

const save = () => {
  try {
    if (valid.value) {
      if (isEditing.value) {
        store.dispatch("user/updateUser", record.value);
        reset();
        fetchUsers();
      } else {
        store.dispatch("user/createUser", record.value);
        reset();
        fetchUsers();
      }
    } else {
      showAlertMessage("error", "Erro ao salvar", "Preencha todos os campos corretamente.");
    }
  } catch (error) {
    showAlertMessage("error", error.message, error.error);
  }
};

const reset = () => {
  dialogForm.value = false;
  record.value = { ...DEFAULT_RECORD };
  isEditing.value = false;
  recordId.value = null;
  valid.value = true;
};

const showAlertMessage = (type, title, message) => {
  typeAlert.value = type;
  titleAlert.value = title;
  messageAlert.value = message;
  showAlert.value = true;
};

const closeDialogForm = () => {
  dialogForm.value = false;
};
</script>

<template>
  <div class="content">
    <v-alert
      closable
      v-model="showAlert"
      :title="titleAlert"
      :text="messageAlert"
      :type="typeAlert"
      class="alert"
    ></v-alert>

    <Table :itens="itens" :headers="headers" @add="add" @edit="edit" @delete="del" @reset="reset" />

    <Form
      v-model:dialog="dialogForm"
      :isEditing="isEditing"
      :record="record"
      @save="save"
      @close="closeDialogForm"
    />

    <ConfirmDeleteDialog
      :visible="dialogDelete"
      text="Deseja realmente remover este usuário?"
      @close="dialogDelete = false"
      @confirm-delete="remove"
    />
  </div>
</template>

<style scoped>
.content {
  width: 90%;
  height: 90%;
  background-color: var(--color-primary);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border-radius: 10px;
}

.alert {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  height: auto;
  z-index: 1000;
}
</style>
