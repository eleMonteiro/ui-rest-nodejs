<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  dialog: {
    type: Boolean,
    required: true,
  },
  isEditing: {
    type: Boolean,
    required: true,
  },
  record: {
    type: Object,
    required: true,
  },
});

const showPassword = ref(false);
const roles = ["ADMIN", "CLIENTE"];

const emit = defineEmits(["update:dialog", "save", "close"]);

const dialogVisible = computed({
  get: () => props.dialog,
  set: (value) => emit("update:dialog", value),
});

const rules = {
  required: (v) => !!v || "Campo obrigatório.",
  min: (v) => v.length >= 8 || "Minimo 8 caracteres",
};

const save = () => {
  emit("save");
};

const closeDialog = () => {
  emit("close");
};
</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="auto">
    <v-card :title="`${isEditing ? 'Editar' : 'Adicionar'} um usuário`" color="white">
      <template v-slot:text>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="record.cpf"
              label="CPF"
              :rules="[rules.required]"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="record.name"
              label="Nome"
              :rules="[rules.required]"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="record.dateOfBirth"
              label="Data de Nascimento"
              :rules="[rules.required]"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="record.email"
              label="Email"
              :rules="[rules.required]"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="record.password"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="showPassword ? 'text' : 'password'"
              hint="Pelo menos 8 caracteres"
              label="Senha"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-select
              placeholder="Select..."
              v-model="record.role"
              :items="roles"
              label="Perfil"
              :rules="[rules.required]"
              variant="outlined"
              required
            ></v-select>
          </v-col>
        </v-row>
      </template>

      <v-card-actions>
        <v-btn text="Cancelar" color="error" variant="flat" @click="closeDialog"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Salvar" color="success" variant="flat" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.stepper-header-flat {
  background: transparent !important;
  box-shadow: none !important;
  border-bottom: none !important;
}
</style>
