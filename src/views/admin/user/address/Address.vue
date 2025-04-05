<script setup>
import { ref, computed, defineEmits, defineProps } from "vue";
import { useStore } from "vuex";
import { formatCep, applyCepMask, unformatCep } from "@/utils/masks";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";

const store = useStore();

const props = defineProps({
  itens: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:itens"]);

const dialog = ref(false);
const isEditing = ref(false);
const editedIndex = ref(-1);
const isLoadingCep = ref(false);
const formValid = ref(false);
const dialogDelete = ref(false);
const recordItem = ref(null);

const headers = [
  { title: "ID", key: "id", align: "center" },
  { title: "CEP", key: "cep", align: "center" },
  { title: "Rua", key: "road", align: "center" },
  { title: "Número", key: "number", align: "center" },
  { title: "Complemento", key: "complement", align: "center" },
  { title: "Bairro", key: "neighborhood", align: "center" },
  { title: "Cidade", key: "city", align: "center" },
  { title: "UF", key: "uf", align: "center" },
  { title: "", key: "actions", sortable: false, align: "center" },
];

const RECORD_DEFAULT = {
  cep: "",
  road: "",
  neighborhood: "",
  city: "",
  uf: "",
  complement: "",
  number: "",
};

const editedItem = ref({ ...RECORD_DEFAULT });

const formTitle = computed(() => {
  return isEditing.value ? "Editar Endereço" : "Novo Endereço";
});

const localItens = computed({
  get: () => (Array.isArray(props.itens) ? props.itens : []),
  set: (value) => {
    if (Array.isArray(value)) {
      emit("update:itens", value);
    }
  },
});

const openDialog = () => {
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  setTimeout(() => {
    editedItem.value = { ...RECORD_DEFAULT };
    editedIndex.value = -1;
    isEditing.value = false;
    formValid.value = false;
  }, 300);
};

const edit = (item) => {
  isEditing.value = true;
  editedIndex.value = props.itens.indexOf(item);
  editedItem.value = { ...item };
  editedItem.value.cep = formatCep(item.cep);
  dialog.value = true;

  setTimeout(() => {
    validateForm();
  }, 100);
};

const del = (item) => {
  recordItem.value = item;
  dialogDelete.value = true;
};

const deleteItem = async () => {
  const index = props.itens.indexOf(recordItem.value);
  if (index === -1) return;
  localItens.value.splice(index, 1);

  store.dispatch("snackbar/showSnackbar", {
    message: "Endereço removido da lista de endereços com sucesso!",
    color: "success",
  });
};

const save = () => {
  if (!formValid.value) return;

  const updatedItems = [...localItens.value];
  if (isEditing.value) {
    updatedItems[editedIndex.value] = { ...editedItem.value };

    store.dispatch("snackbar/showSnackbar", {
      message: "Endereço atualizado com sucesso!",
      color: "success",
    });
  } else {
    updatedItems.push({ ...editedItem.value });

    store.dispatch("snackbar/showSnackbar", {
      message: "Endereço adicionado a lista de endereços com sucesso!",
      color: "success",
    });
  }

  emit("update:itens", updatedItems);
  closeDialog();
};

const fetchAddressByCep = async () => {
  const cep = unformatCep(editedItem.value.cep);
  if (cep.length !== 8) return;

  isLoadingCep.value = true;
  try {
    await store.dispatch("cep/getAddressByCep", cep);
    const data = store.getters["cep/address"];

    if (data) {
      editedItem.value.road = data.logradouro || "";
      editedItem.value.neighborhood = data.bairro || "";
      editedItem.value.city = data.localidade || "";
      editedItem.value.uf = data.uf || "";
    } else {
      store.dispatch("snackbar/showSnackbar", {
        message: "CEP não encontrado na base de dados.",
        color: "error",
      });
    }
  } catch (error) {
    store.dispatch("snackbar/showSnackbar", {
      message: "Erro ao buscar endereço pelo CEP.",
      color: "error",
    });
  } finally {
    isLoadingCep.value = false;
  }
};

const handleCepInput = (event) => {
  const inputValue = event.target.value;
  const unformattedValue = unformatCep(inputValue);
  if (unformattedValue.length > 8) {
    editedItem.value.cep = formatCep(unformattedValue);
  } else {
    editedItem.value.cep = applyCepMask(event);
  }
};

const handleCepBlur = async () => {
  if (editedItem.value.cep.length === 10) {
    await fetchAddressByCep();
  }
};

const validateForm = () => {
  const requiredFieldsValid =
    editedItem.value.cep?.length === 10 &&
    !!editedItem.value.road &&
    !!editedItem.value.number &&
    !!editedItem.value.neighborhood &&
    !!editedItem.value.city &&
    editedItem.value.uf?.length === 2;

  const optionalFieldsValid = true;

  formValid.value = requiredFieldsValid && optionalFieldsValid;
};
</script>

<template>
  <div>
    <v-card class="mb-6" elevation="0">
      <v-data-table
        :key="itens?.length"
        :headers="headers"
        :items="itens"
        :items-per-page="5"
        :loading="loading"
        loading-text="Carregando endereços..."
        no-data-text="Nenhum endereço cadastrado"
        height="150px"
        fixed-header
      >
        <template #top>
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title class="text-h6">Endereços Cadastrados</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-plus"
              color="white"
              variant="tonal"
              @click="openDialog"
              title="Adicionar novo endereço"
            ></v-btn>
          </v-toolbar>
        </template>

        <template #item.actions="{ item }">
          <div class="d-flex ga-2 justify-end">
            <v-tooltip text="Editar" location="top">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  color="primary"
                  icon="mdi-pencil"
                  size="small"
                  @click="edit(item)"
                ></v-icon>
              </template>
            </v-tooltip>

            <v-tooltip text="Excluir" location="top">
              <template #activator="{ props }">
                <v-icon
                  v-bind="props"
                  color="error"
                  icon="mdi-delete"
                  size="small"
                  @click="del(item)"
                ></v-icon>
              </template>
            </v-tooltip>
          </div>
        </template>

        <template #item.cep="{ item }">
          {{ formatCep(item.cep) }}
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="1000" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text class="pt-4">
          <v-form @submit.prevent="save" v-model="formValid" @input="validateForm">
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.cep"
                    label="CEP"
                    required
                    variant="outlined"
                    :loading="isLoadingCep"
                    :rules="[
                      (v) => !!v || 'CEP é obrigatório',
                      (v) => v.length === 10 || 'CEP inválido',
                    ]"
                    @input="handleCepInput"
                    @blur="handleCepBlur"
                    prepend-inner-icon="mdi-map-marker"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="8">
                  <v-text-field
                    v-model="editedItem.road"
                    label="Logradouro"
                    required
                    variant="outlined"
                    :rules="[(v) => !!v || 'Logradouro é obrigatório']"
                    prepend-inner-icon="mdi-road"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.number"
                    label="Número"
                    required
                    variant="outlined"
                    :rules="[(v) => !!v || 'Número é obrigatório']"
                    prepend-inner-icon="mdi-numeric"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="8">
                  <v-text-field
                    v-model="editedItem.complement"
                    label="Complemento"
                    variant="outlined"
                    placeholder="Ex: Apartamento 101, Bloco B"
                    prepend-inner-icon="mdi-home-plus"
                    :rules="[]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="editedItem.neighborhood"
                    label="Bairro"
                    required
                    variant="outlined"
                    :rules="[(v) => !!v || 'Bairro é obrigatório']"
                    prepend-inner-icon="mdi-google-maps"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.city"
                    label="Cidade"
                    required
                    variant="outlined"
                    :rules="[(v) => !!v || 'Cidade é obrigatória']"
                    prepend-inner-icon="mdi-city"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="2">
                  <v-text-field
                    v-model="editedItem.uf"
                    label="UF"
                    required
                    variant="outlined"
                    :rules="[
                      (v) => !!v || 'UF é obrigatória',
                      (v) => v.length === 2 || 'UF deve ter 2 caracteres',
                    ]"
                    prepend-inner-icon="mdi-map-marker-radius"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="pa-4">
          <v-btn color="error" variant="flat" @click="closeDialog"> Cancelar </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            variant="flat"
            @click="save"
            :loading="isLoadingCep"
            :disabled="!formValid"
          >
            <v-icon start icon="mdi-content-save"></v-icon>
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ConfirmDeleteDialog
      v-model="dialogDelete"
      @confirm-delete="deleteItem"
      @close="dialogDelete = false"
      text="Deseja realmente remover este endereço?"
    ></ConfirmDeleteDialog>
  </div>
</template>

<style scoped>
.v-card {
  border-radius: 8px;
}

.v-toolbar {
  border-radius: 8px 8px 0 0;
}

.v-data-table {
  border-radius: 0 0 8px 8px;
}

.v-text-field :deep(.v-input__details) {
  padding-left: 4px;
}

.v-dialog .v-card {
  overflow: hidden;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

:deep(.v-field__prepend-inner) {
  padding-right: 8px;
}
</style>
