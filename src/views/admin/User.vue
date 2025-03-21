<script setup>
import { onMounted, ref, shallowRef } from 'vue'
import { useDate } from 'vuetify'
import { useStore } from 'vuex'

const store = useStore()
const adapter = useDate()

const DEFAULT_RECORD = { name: '', cpf: '', dateOfBirth: '', password: '', email: '' }

const itens = ref([])
const record = ref(DEFAULT_RECORD)
const dialog = shallowRef(false)
const isEditing = shallowRef(false)

const headers = [
  { title: 'ID', key: 'id', align: 'center' },
  { title: 'Nome', key: 'name', align: 'center' },
  { title: 'CPF', key: 'cpf', align: 'center' },
  { title: 'Data de Nascimento', key: 'dateOfBirth', align: 'center' },
  { title: 'Email', key: 'email', align: 'center' },
  { title: '', key: 'actions', sortable: false, align: 'center' }
]

onMounted(async () => {
  reset()
  await store.dispatch("getUsers")
  itens.value = store.getters.users
})

function add() {
  isEditing.value = false
  record.value = DEFAULT_RECORD
  dialog.value = true
}

function edit(id) {
  isEditing.value = true;
  store.dispatch("getUser", id).then(() => {
    record.value = { ...store.getters.user };
    dialog.value = true;
  });
}

function remove(id) {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    store.dispatch("deleteUser", id);
  }
}


function save() {
  if (isEditing.value) {
    store.dispatch("updateUser", record.value).then(() => {
      reset();
    });
  } else {
    store.dispatch("createUser", record.value).then(() => {
      reset();
    });
  }
}

function reset() {
  dialog.value = false;
  record.value = { ...DEFAULT_RECORD };
  isEditing.value = false;
}
</script>

<template>
  <div class="content">
    <v-data-table :headers="headers" :hide-default-footer="itens.length < 11" :items="itens" class="table">
      <template v-slot:top>
        <v-toolbar class="header-table">
          <v-toolbar-title> Usuários </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon="mdi-plus" @click="add"></v-btn>
        </v-toolbar>
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-icon color="white" icon="mdi-pencil" size="small" @click="edit(item.id)"></v-icon>

          <v-icon color="white" icon="mdi-delete" size="small" @click="remove(item.id)"></v-icon>
        </div>
      </template>

      <template v-slot:no-data>
        <v-btn prepend-icon="mdi-backup-restore" rounded="lg" text="Reset data" variant="text" @click="reset"></v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500">
      <v-card :subtitle="`${isEditing ? 'Update' : 'Create'} your favorite book`"
        :title="`${isEditing ? 'Edit' : 'Add'} a Book`">
        <template v-slot:text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="record.title" label="Title"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field v-model="record.author" label="Author"></v-text-field>
            </v-col>

            <v-col cols="12" md="6">
              <v-select v-model="record.genre" :items="['Fiction', 'Dystopian', 'Non-Fiction', 'Sci-Fi']"
                label="Genre"></v-select>
            </v-col>

            <v-col cols="12" md="6">
              <v-number-input v-model="record.year" :max="adapter.getYear(adapter.date())" :min="1"
                label="Year"></v-number-input>
            </v-col>

            <v-col cols="12" md="6">
              <v-number-input v-model="record.pages" :min="1" label="Pages"></v-number-input>
            </v-col>
          </v-row>
        </template>

        <v-divider></v-divider>

        <v-card-actions class="bg-surface-light">
          <v-btn text="Cancel" variant="plain" @click="dialog = false"></v-btn>

          <v-spacer></v-spacer>

          <v-btn text="Save" @click="save"></v-btn>
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
</style>
