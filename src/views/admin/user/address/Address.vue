<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  itens: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:itens"]);

const dialog = ref(false);
const isEditing = ref(false);
const editedIndex = ref(-1);

const editedItem = ref({
  cep: "",
  road: "",
  neighborhood: "",
  city: "",
  uf: "",
  complement: "",
  number: "",
});

const defaultItem = ref({
  cep: "",
  road: "",
  neighborhood: "",
  city: "",
  uf: "",
  complement: "",
  number: "",
});

const formTitle = computed(() => {
  return isEditing.value ? "Editar Endereço" : "Novo Endereço";
});

const localItens = computed({
  get: () => props.itens,
  set: (value) => emit("update:itens", value),
});

const openDialog = () => {
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  setTimeout(() => {
    editedItem.value = { ...defaultItem.value };
    editedIndex.value = -1;
    isEditing.value = false;
  }, 300);
};

const editItem = (item) => {
  isEditing.value = true;
  editedIndex.value = props.itens.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
};

const deleteItem = (item) => {
  const index = props.itens.indexOf(item);
  if (confirm("Tem certeza que deseja remover este endereço?")) {
    localItens.value.splice(index, 1);
  }
};

const save = () => {
  if (isEditing.value) {
    Object.assign(localItens.value[editedIndex.value], editedItem.value);
  } else {
    localItens.value.push(editedItem.value);
  }
  closeDialog();
};
</script>

<template>
  <div>
    <v-data-table :headers="headers" :items="itens" :items-per-page="5" class="elevation-1">
      <template #top>
        <v-toolbar class="header-table">
          <v-toolbar-title> Endereços </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon="mdi-plus" color="primary" @click="openDialog"></v-btn>
        </v-toolbar>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon color="primary" icon="mdi-pencil" size="small" @click="editItem(item)"></v-icon>
          <v-icon color="primary" icon="mdi-delete" size="small" @click="deleteItem(item)"></v-icon>
        </div>
      </template>

      <template #no-data>
        <v-btn
          prepend-icon="mdi-backup-restore"
          rounded="lg"
          text="Reset data"
          variant="text"
        ></v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.cep"
                  label="CEP"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="8">
                <v-text-field
                  v-model="editedItem.road"
                  label="Rua"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.number"
                  label="Número"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="8">
                <v-text-field
                  v-model="editedItem.complement"
                  label="Complemento"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field
                  v-model="editedItem.neighborhood"
                  label="Bairro"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="editedItem.city"
                  label="Cidade"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2">
                <v-text-field
                  v-model="editedItem.uf"
                  label="UF"
                  required
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn text="Cancelar" color="error" variant="flat" @click="closeDialog"></v-btn>

          <v-spacer></v-spacer>

          <v-btn text="Salvar" color="success" variant="flat" @click="save"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  height: 200px;
  color: var(--color-primary);
}

.header-table {
  color: var(--color-primary);
  text-align: left;
}
</style>
