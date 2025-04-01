<script setup>
import { ref, computed, watch } from "vue";
import Address from "./address/Address.vue";
import { applyCpfMask, validateCpf, formatCpf, applyDateMask, validateDate } from "@/utils/masks";

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

const emit = defineEmits(["update:dialog", "save", "close", "update:record"]);

const roles = ["ADMIN", "CLIENTE"];
const localRecord = ref({ ...props.record });

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

const dialogVisible = computed({
  get: () => props.dialog,
  set: (value) => emit("update:dialog", value),
});

const rules = {
  required: (v) => !!v || "Campo obrigatório.",
  min: (v) => v.length >= 8 || "Minimo 8 caracteres",
  cpf: (value) => {
    const digits = value?.replace(/\D/g, "") || "";
    return digits.length === 11 || "CPF deve ter 11 dígitos";
  },
};

const save = () => {
  emit("save", localRecord.value);
};

const closeDialog = () => {
  emit("close");
};

watch(
  () => props.isEditing,
  (editing) => {
    if (editing) {
      formatInitialValues();
    }
  }
);

watch(
  () => props.record,
  (newVal) => {
    localRecord.value = { ...newVal };
  },
  { deep: true }
);

watch(
  () => localRecord.value,
  (newVal) => {
    emit("update:record", { ...newVal });
  },
  { deep: true }
);

function formatInitialValues() {
  if (localRecord.value.cpf) {
    localRecord.value.cpf = formatCpf(localRecord.value.cpf);
  }
}

const handleCpfInput = (event) => {
  localRecord.value.cpf = applyCpfMask(event);
};

const handleCpfBlur = () => {
  if (localRecord.value?.cpf) {
    localRecord.value.cpf = validateCpf(localRecord.value.cpf);
  }
};

const handleValidateDate = () => {
  if (!validateDate(localRecord.value.dateOfBirth)) {
    localRecord.value.dateOfBirth = "";
  }
};
</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="auto">
    <v-card :title="`${isEditing ? 'Editar' : 'Adicionar'} um usuário`" color="white">
      <template #text>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="localRecord.cpf"
              label="CPF"
              :rules="[rules.required, rules.cpf]"
              variant="outlined"
              @input="handleCpfInput"
              @blur="handleCpfBlur"
              hint="Formato: 000.000.000-00"
              required
              maxlength="14"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="localRecord.name"
              label="Nome"
              :rules="[rules.required]"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="localRecord.dateOfBirth"
              label="Data de Nascimento"
              :rules="[rules.required]"
              variant="outlined"
              required
              @input="applyDateMask"
              @blur="handleValidateDate"
              placeholder="DD/MM/AAAA"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="localRecord.email"
              label="Email"
              :rules="[rules.required]"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="localRecord.password"
              :rules="[rules.required, rules.min]"
              type="password"
              hint="Pelo menos 8 caracteres"
              label="Senha"
              variant="outlined"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-select
              placeholder="Select..."
              v-model="localRecord.role"
              :items="roles"
              label="Perfil"
              :rules="[rules.required]"
              variant="outlined"
              required
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <Address :itens="localRecord?.addresses || []" :headers="headers"></Address>
          </v-col>
        </v-row>
      </template>

      <v-card-actions>
        <v-btn text="Cancelar" color="error" variant="flat" @click="closeDialog"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Salvar" color="success" variant="flat" @click="save(localRecord)"></v-btn>
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
