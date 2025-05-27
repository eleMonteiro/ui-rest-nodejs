<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import useSnackbar from "@/composables/useSnackbar";

const { showMessage } = useSnackbar();
const store = useStore();

const props = defineProps({
  userId: Number,
  itens: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  isProfile: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:itens", "update:addresses"]);

const RECORD_DEFAULT = {
  cep: "",
  road: "",
  neighborhood: "",
  city: "",
  uf: "",
  complement: "",
  number: "",
};

const headers = [
  { title: "ID", key: "id", align: "center" },
  { title: "CEP", key: "cep", align: "center" },
  { title: "Rua", key: "road", align: "center" },
  { title: "Número", key: "number", align: "center" },
  { title: "Complemento", key: "complement", align: "center" },
  { title: "Bairro", key: "neighborhood", align: "center" },
  { title: "Cidade", key: "city", align: "center" },
  { title: "UF", key: "uf", align: "center" },
  { title: "Ações", key: "actions", sortable: false, align: "center" },
];

const dialog = ref(false);
const isEditing = ref(false);
const editedIndex = ref(-1);
const isLoadingCep = ref(false);
const formValid = ref(false);
const dialogDelete = ref(false);
const recordItem = ref(null);
const editedItem = ref({ ...RECORD_DEFAULT });

const formTitle = computed(() => (isEditing.value ? "Editar Endereço" : "Novo Endereço"));

const localItens = computed({
  get: () => (Array.isArray(props.itens) ? props.itens : []),
  set: (value) => Array.isArray(value) && emit("update:itens", value),
});

const openDialog = () => {
  dialog.value = true;
  isEditing.value = false;
};

const closeDialog = () => {
  dialog.value = false;
  setTimeout(resetForm, 300);
};

const resetForm = () => {
  editedItem.value = { ...RECORD_DEFAULT };
  editedIndex.value = -1;
  isEditing.value = false;
  formValid.value = false;
};

const prepareEdit = (item) => {
  isEditing.value = true;
  editedIndex.value = props.itens.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
  setTimeout(validateForm, 100);
};

const prepareDelete = (item) => {
  recordItem.value = item;
  dialogDelete.value = true;
};

const deleteItem = async () => {
  props.isProfile ? await handleProfileDelete() : handleLocalDelete();
};

const handleProfileDelete = async () => {
  try {
    const response = await store.dispatch("address/deleteAddress", recordItem.value.id);
    showMessage(response);
    response?.success && emit("update:addresses");
  } catch {
    showMessage({ success: false, message: "Erro ao remover endereço" });
  }
};

const handleLocalDelete = () => {
  const index = props.itens.indexOf(recordItem.value);
  if (index === -1) return;

  localItens.value.splice(index, 1);
  showMessage({ success: true, message: "Endereço removido da grid com sucesso!" });
};

const save = async () => {
  if (!formValid.value) return;

  if (shouldConvertToEdit()) {
    convertToEdit();
  }

  props.isProfile ? await handleProfileSave() : handleLocalSave();

  closeDialog();
};

const shouldConvertToEdit = () => {
  return !isEditing.value && existAddress(editedItem.value);
};

const convertToEdit = () => {
  const cepDigits = sanitizeCep(editedItem.value.cep);

  if (props.isProfile) {
    editedItem.value.id = findMatchingItemId(cepDigits);
    editedItem.value.userId = props.userId;
  } else {
    editedIndex.value = findEditedIndex(cepDigits);
  }

  isEditing.value = true;
};

const handleProfileSave = async () => {
  const action = isEditing.value ? "address/updateAddress" : "address/createAddress";

  const payload = isEditing.value
    ? { id: editedItem.value.id, data: editedItem.value }
    : { ...editedItem.value, userId: props.userId };

  const response = await store.dispatch(action, payload);
  showMessage(response);
  response?.success && emit("update:addresses");
};

const handleLocalSave = () => {
  const updatedItems = [...localItens.value];
  editedItem.value.cep = sanitizeCep(editedItem.value.cep);

  if (isEditing.value) {
    updatedItems[editedIndex.value] = { ...editedItem.value };
    showMessage({ success: true, message: "Endereço atualizado na grid com sucesso!" });
  } else {
    updatedItems.push({ ...editedItem.value });
    showMessage({ success: true, message: "Endereço adicionado na grid com sucesso!" });
  }

  emit("update:itens", updatedItems);
};

const existAddress = (address) => {
  const cepDigits = sanitizeCep(address.cep);
  return localItens.value.some((item) => sanitizeCep(item.cep) === cepDigits);
};

const sanitizeCep = (cep) => cep.replace(/\D/g, "");

const findMatchingItemId = (cepDigits) =>
  props.itens.find((item) => sanitizeCep(item.cep) === cepDigits)?.id;

const findEditedIndex = (cepDigits) =>
  localItens.value.findIndex((item) => sanitizeCep(item.cep) === cepDigits);

const handleCepBlur = async () => {
  if (editedItem.value.cep.length === 10) {
    await fetchAddressByCep();
  }
};

const fetchAddressByCep = async () => {
  isLoadingCep.value = true;
  try {
    const cepFormatted = sanitizeCep(editedItem.value.cep);
    await store.dispatch("cep/getAddressByCep", cepFormatted);
    const data = store.getters["cep/address"];

    if (data?.cep) {
      updateAddressFields(data);
    }
  } catch {
    showMessage({ success: false, message: "Erro ao buscar endereço pelo CEP" });
  } finally {
    isLoadingCep.value = false;
  }
};

const updateAddressFields = (data) => {
  editedItem.value.road = data.logradouro || "";
  editedItem.value.neighborhood = data.bairro || "";
  editedItem.value.city = data.localidade || "";
  editedItem.value.uf = data.uf || "";
};

const validateForm = () => {
  const { cep, road, number, neighborhood, city, uf } = editedItem.value;
  formValid.value =
    cep?.length === 10 && !!road && !!number && !!neighborhood && !!city && uf?.length === 2;
};
</script>

<template>
  <div class="address-container" :class="{ profile: isProfile }">
    <v-card class="address-card" elevation="2">
      <v-data-table
        :key="itens?.length"
        :headers="headers"
        :items="itens"
        :items-per-page="5"
        :loading="loading"
        loading-text="Carregando endereços..."
        no-data-text="Nenhum endereço cadastrado"
        fixed-header
        class="address-table"
        :class="{ profile: isProfile }"
      >
        <template #top>
          <v-toolbar class="address-toolbar" :class="{ profile: isProfile }" density="comfortable">
            <v-toolbar-title class="address-title" :class="{ profile: isProfile }"
              >Endereços</v-toolbar-title
            >
            <v-spacer />
            <v-btn
              icon="mdi-plus"
              :color="isProfile ? 'text' : 'primary'"
              variant="tonal"
              @click="openDialog"
              aria-label="Adicionar novo endereço"
            />
          </v-toolbar>
        </template>

        <template #item.actions="{ item }">
          <div class="address-actions">
            <v-btn
              icon="mdi-pencil"
              :color="isProfile ? 'text' : 'primary'"
              variant="text"
              size="small"
              @click="prepareEdit(item)"
              aria-label="Editar endereço"
            />
            <v-btn
              icon="mdi-delete"
              :color="isProfile ? 'text' : 'primary'"
              variant="text"
              size="small"
              @click="prepareDelete(item)"
              aria-label="Excluir endereço"
            />
          </div>
        </template>

        <template #item.cep="{ item }">
          {{ item?.cep }}
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="800" scrollable persistent>
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-divider />

        <v-card-text class="dialog-content">
          <v-form @submit.prevent="save" v-model="formValid" @input="validateForm">
            <v-container class="form-container">
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.cep"
                    label="CEP *"
                    :loading="isLoadingCep"
                    :disabled="isEditing"
                    :rules="[
                      (v) => !!v || 'CEP é obrigatório',
                      (v) => v.length === 10 || 'CEP inválido',
                    ]"
                    @blur="handleCepBlur"
                    v-mask="'##.###-###'"
                    prepend-inner-icon="mdi-map-marker"
                    persistent-hint
                    :hint="isEditing ? '' : 'Digite o CEP para auto completar'"
                    class="custom-text-field"
                  />
                </v-col>

                <v-col cols="12" sm="6" md="8">
                  <v-text-field
                    v-model="editedItem.road"
                    label="Logradouro *"
                    :rules="[(v) => !!v || 'Logradouro é obrigatório']"
                    prepend-inner-icon="mdi-road"
                    class="custom-text-field"
                  />
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.number"
                    label="Número *"
                    :rules="[(v) => !!v || 'Número é obrigatório']"
                    prepend-inner-icon="mdi-numeric"
                    class="custom-text-field"
                  />
                </v-col>

                <v-col cols="12" sm="6" md="8">
                  <v-text-field
                    v-model="editedItem.complement"
                    label="Complemento"
                    placeholder="Ex: Apartamento 101, Bloco B"
                    prepend-inner-icon="mdi-home-plus"
                    class="custom-text-field"
                  />
                </v-col>

                <v-col cols="12" sm="6" md="6">
                  <v-text-field
                    v-model="editedItem.neighborhood"
                    label="Bairro *"
                    :rules="[(v) => !!v || 'Bairro é obrigatório']"
                    prepend-inner-icon="mdi-google-maps"
                    class="custom-text-field"
                  />
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    v-model="editedItem.city"
                    label="Cidade *"
                    :rules="[(v) => !!v || 'Cidade é obrigatória']"
                    prepend-inner-icon="mdi-city"
                    class="custom-text-field"
                  />
                </v-col>

                <v-col cols="12" sm="6" md="2">
                  <v-text-field
                    v-model="editedItem.uf"
                    label="UF *"
                    :rules="[
                      (v) => !!v || 'UF é obrigatória',
                      (v) => v.length === 2 || 'UF deve ter 2 caracteres',
                    ]"
                    prepend-inner-icon="mdi-map-marker-radius"
                    class="custom-text-field"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="dialog-actions">
          <v-btn color="primary" variant="flat" @click="closeDialog">
            <v-icon icon="mdi mdi-cancel" start /> Cancelar
          </v-btn>
          <v-spacer />
          <v-btn
            color="secondary"
            variant="flat"
            @click="save"
            :loading="isLoadingCep"
            :disabled="!formValid"
          >
            <v-icon start icon="mdi-content-save" />
            {{ isProfile ? "Cadastrar" : "Adicionar" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <ConfirmDeleteDialog
      v-model:visible="dialogDelete"
      @confirm="deleteItem"
      @cancel="dialogDelete = false"
      text="Deseja realmente remover este endereço?"
    />
  </div>
</template>

<style scoped>
.address-container.profile {
  display: flex;
  flex-direction: column;
  height: 100px;
  width: 100%;
}

.address-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 8px;
  background-color: transparent;
}

.address-table {
  flex: 1;
  min-height: 100px;
  background-color: var(--color-background-card) !important;
  color: var(--color-text-input);
}

.address-table.profile {
  flex: 1;
  min-height: 100px;
  background-color: var(--color-primary) !important;
  color: var(--color-text-input);
}

.address-table.profile {
  color: var(--color-text);
}

.address-table :deep(.v-data-table__td) {
  background-color: var(--color-background-card) !important;
}

.address-table.profile :deep(.v-data-table__td) {
  background-color: var(--color-primary) !important;
}

.address-toolbar {
  background-color: var(--color-background-card) !important;
}

.address-toolbar.profile {
  background-color: var(--color-primary) !important;
}

.address-title {
  font-weight: 500;
  color: var(--color-text-input);
}

.address-title.profile {
  font-weight: 500;
  color: var(--color-text);
}

.address-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.dialog-card {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-card);
  color: var(--color-text-input);
}

.dialog-title {
  padding: 16px 24px;
}

.dialog-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.dialog-actions {
  padding: 12px 24px;
}

.form-container {
  padding: 0;
}

.v-btn {
  min-width: 0;
}

.v-text-field :deep(.v-input__details) {
  padding-left: 4px;
}

.custom-text-field {
  color: var(--color-text-input);
}

.custom-text-field :deep(input) {
  background-color: var(--color-background-input);
  color: var(--color-text-input);
  border: none;
  font-size: 1em;
  font-weight: 200;
}

.custom-text-field :deep(.v-messages__message) {
  color: var(--color-text-input);
}

.custom-text-field :deep(.v-input__control) {
  background-color: var(--color-background-input);
}

@media (max-width: 960px) {
  .dialog-card {
    max-width: 95vw;
  }

  .form-container {
    padding: 0 8px;
  }
}

@media (max-width: 600px) {
  .address-actions {
    flex-direction: column;
    gap: 4px;
  }

  .dialog-title,
  .dialog-actions {
    padding: 12px 16px;
  }

  .dialog-content {
    padding: 12px 16px;
  }
}
</style>
