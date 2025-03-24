<script setup>
import { onMounted, ref, shallowRef, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const DEFAULT_RECORD_ROLE = {
  id: "",
};

const DEFAULT_RECORD_ADDRESS = {
  road: "",
  cep: "",
  neighborhood: "",
  city: "",
  uf: "",
};

const DEFAULT_RECORD = {
  name: "",
  cpf: "",
  dateOfBirth: "",
  password: "",
  email: "",
  roles: [],
  addresses: [],
};

const itens = ref([]);
const record = ref(DEFAULT_RECORD);
const recordRole = ref(DEFAULT_RECORD_ROLE);
const recordAddress = ref(DEFAULT_RECORD_ADDRESS);
const dialog = shallowRef(false);
const isEditing = shallowRef(false);
const dialogDelete = shallowRef(false);
const valid = ref(true);

const recordId = ref(null);

const typeAlert = ref("success");
const messageAlert = ref("");
const titleAlert = ref("");
const showAlert = ref(false);

const e1 = ref(1);
const steps = ref(3);

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
  dialog.value = true;
};

const edit = (id) => {
  isEditing.value = true;
  store.dispatch("user/getUser", id).then(() => {
    record.value = { ...store.getters["user/user"] };
    dialog.value = true;
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
  dialog.value = false;
  record.value = { ...DEFAULT_RECORD };
  isEditing.value = false;
  recordId.value = null;
  valid.value = true;
};

const formatCPF = (cpf) => {
  if (!cpf) return null;
  cpf = cpf.replace(/\D/g, "");
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

const showAlertMessage = (type, title, message) => {
  typeAlert.value = type;
  titleAlert.value = title;
  messageAlert.value = message;
  showAlert.value = true;
};

const disabled = computed(() => {
  return e1.value === 1 ? "prev" : e1.value === steps.value ? "next" : undefined;
});
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

    <v-data-table
      :headers="headers"
      :hide-default-footer="itens.length < 11"
      :items="itens"
      class="table"
    >
      <template v-slot:top>
        <v-toolbar class="header-table">
          <v-toolbar-title> Usuários </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon="mdi-plus" @click="add"></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.cpf="{ item }">
        {{ formatCPF(item.cpf) }}
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon color="white" icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>

          <v-icon color="white" icon="mdi-delete" size="small" @click="del(item.id)"></v-icon>
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
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600">
      <v-card :title="`${isEditing ? 'Editar' : 'Adicionar'} um usuário`" color="white">
        <template v-slot:text>
          <v-container>
            <v-row justify="center">
              <v-col cols="12">
                <v-stepper v-model="e1" flat>
                  <template v-slot:default="{ prev, next }">
                    <v-stepper-header flat elevation="0" class="stepper-header-flat">
                      <template v-for="n in steps" :key="`${n}-step`">
                        <v-stepper-item
                          :complete="e1 > n"
                          :step="`Step {{ n }}`"
                          :value="n"
                          editable
                        ></v-stepper-item>

                        <v-divider v-if="n !== steps" :key="n"></v-divider>
                      </template>
                    </v-stepper-header>

                    <v-stepper-window>
                      <v-stepper-window-item :value="1">
                        <v-card color="grey-lighten-1" height="200"> </v-card>
                      </v-stepper-window-item>

                      <v-stepper-window-item :value="2">
                        <v-card color="grey-lighten-2" height="200"> </v-card>
                      </v-stepper-window-item>

                      <v-stepper-window-item :value="3">
                        <v-card color="grey-lighten-3" height="200"> </v-card>
                      </v-stepper-window-item>
                    </v-stepper-window>

                    <v-stepper-actions
                      :disabled="disabled"
                      @click:next="next"
                      @click:prev="prev"
                    ></v-stepper-actions>
                  </template>
                </v-stepper>
              </v-col>
            </v-row>
          </v-container>
        </template>

        <v-card-actions>
          <v-btn text="Cancelar" color="error" variant="flat" @click="dialog = false"></v-btn>

          <v-spacer></v-spacer>

          <v-btn text="Salvar" color="success" variant="flat" @click="save"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDelete" max-width="500">
      <v-card>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <p>Tem certeza que deseja remover o usuário?</p>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn text="Cancelar" color="error" variant="flat" @click="dialogDelete = false"></v-btn>

          <v-spacer></v-spacer>

          <v-btn text="Remover" color="success" variant="flat" @click="remove"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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

.table {
  width: 100%;
  height: 100%;

  background-color: transparent;
  color: var(--white);
}

.header-table {
  background-color: transparent;
  color: var(--white);
  text-align: center;
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

.stepper-header-flat {
  background: transparent !important;
  box-shadow: none !important;
  border-bottom: none !important;
}
</style>
