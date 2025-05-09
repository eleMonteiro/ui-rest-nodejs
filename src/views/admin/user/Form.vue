<script setup>
import { ref, computed, watch, defineEmits, defineProps } from "vue";
import { validateDate } from "@/utils/validate";
import { useStore } from "vuex";
import Address from "@/views/address/Address.vue";

const props = defineProps({
  dialog: Boolean,
  isEditing: Boolean,
  record: {
    type: Object,
    required: true,
    default: () => ({
      id: "",
      cpf: "",
      name: "",
      dateOfBirth: "",
      email: "",
      password: "",
      role: "",
      addresses: [],
    }),
    validator: (value) => {
      const requiredProps = ["cpf", "name", "dateOfBirth", "role", "addresses"];
      return (
        typeof value === "object" &&
        value !== null &&
        requiredProps.every((prop) => prop in value) &&
        Array.isArray(value.addresses)
      );
    },
  },
});

const store = useStore();
const emit = defineEmits(["update:dialog", "save", "close", "update:record"]);

const roles = ["ADMIN", "CLIENTE"];

const localRecord = ref({
  id: props.record.id || "",
  cpf: props.record.cpf || "",
  name: props.record.name || "",
  dateOfBirth: props.record.dateOfBirth || "",
  email: props.record.email || "",
  password: props.record.password || "",
  role: props.record.role || "",
  addresses: Array.isArray(props.record.addresses)
    ? props.record.addresses.map((addr) => ({ ...addr }))
    : [],
});

const loading = ref(false);
const currentStep = ref(1);
const form = ref(null);

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
  name: (v) => (v && v.length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(v)) || "Nome inválido",
  email: (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
  password: (v) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(v) ||
    "Senha deve conter maiúscula, minúscula, número e caractere especial",
  date: (v) => validateDate(v) || "Data inválida",
  role: (v) => roles.includes(v) || "Perfil inválido",
};

const save = async () => {
  try {
    loading.value = true;

    const { valid } = await form.value.validate();
    if (!valid || !isStep1Valid.value) {
      showMessage({
        success: false,
        message: "Corrija os erros antes de continuar",
      });
      return;
    }

    if (localRecord.value.addresses.length === 0) {
      store.dispatch("snackbar/showSnackbar", {
        text: "Adicione pelo menos um endereço",
        color: "error",
      });
      return;
    }

    emit("save", localRecord.value);
  } catch (error) {
    showMessage(error);
  } finally {
    loading.value = false;
    currentStep.value = 1;
    dialogVisible.value = false;
  }
};

const validateStep1 = async () => {
  const { valid } = await form.value.validate();
  if (valid && isStep1Valid.value) {
    currentStep.value = 2;
  } else {
    showMessage({
      success: false,
      message: "Corrija os erros antes de continuar",
    });
  }
};

const closeDialog = () => emit("close");

const updateAddresses = (newAddresses) => {
  localRecord.value.addresses = newAddresses;
  emit("update:record", { ...localRecord.value });
};

const isStep1Valid = computed(() => {
  return (
    rules.required(localRecord.value.cpf) === true &&
    rules.cpf(localRecord.value.cpf) === true &&
    rules.required(localRecord.value.name) === true &&
    rules.name(localRecord.value.name) === true &&
    rules.required(localRecord.value.dateOfBirth) === true &&
    rules.date(localRecord.value.dateOfBirth) === true &&
    rules.required(localRecord.value.email) === true &&
    rules.required(localRecord.value.role) === true
  );
});

watch(
  () => props.record,
  (newVal) => {
    localRecord.value = {
      id: newVal.id || "",
      cpf: newVal.cpf || "",
      name: newVal.name || "",
      dateOfBirth: newVal.dateOfBirth || "",
      email: newVal.email || "",
      password: newVal.password || "",
      role: newVal.role || "",
      addresses: Array.isArray(newVal.addresses)
        ? newVal.addresses.map((addr) => ({ ...addr }))
        : [],
    };
  },
  { immediate: true, deep: true }
);

watch(
  () => localRecord.value,
  (newVal) => {
    emit("update:record", { ...newVal });
  },
  { deep: true }
);

const showMessage = (response) => {
  const message = response?.success
    ? "Operação realizada com sucesso!"
    : "Erro ao realizar operação!";

  store.dispatch("snackbar/showSnackbar", {
    text: response?.message || message,
    color: response?.success ? "success" : "error",
  });
};
</script>

<template>
  <v-dialog
    v-model="dialogVisible"
    max-width="1000"
    scrollable
    persistent
    aria-labelledby="userFormTitle"
    content-class="full-dialog"
  >
    <v-card
      :title="`${isEditing ? 'Editar' : 'Adicionar'} usuário`"
      id="userFormTitle"
      aria-modal="true"
      class="full-height-card"
      elevation="0"
      variant="flat"
    >
      <v-card-text class="card-content">
        <v-stepper
          v-model="currentStep"
          :items="['Dados Pessoais', 'Endereços']"
          class="full-height-stepper"
          hide-actions
        >
          <template #item.1>
            <v-form ref="form" @submit.prevent="currentStep = 2" class="mb-4">
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    v-model="localRecord.cpf"
                    label="CPF"
                    :rules="[rules.required, rules.cpf]"
                    hint="Formato: 000.000.000-00"
                    required
                    maxlength="14"
                    prepend-inner-icon="mdi-card-account-details"
                    clearable
                    aria-label="CPF do usuário"
                    aria-required="true"
                    v-mask="'###.###.###-##'"
                    class="custom-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="localRecord.name"
                    label="Nome"
                    :rules="[rules.required, rules.name]"
                    required
                    prepend-inner-icon="mdi-account"
                    counter
                    maxlength="100"
                    class="custom-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="localRecord.dateOfBirth"
                    label="Data de Nascimento"
                    :rules="[rules.required, rules.date]"
                    prepend-inner-icon="mdi-calendar"
                    placeholder="DD/MM/AAAA"
                    v-mask="'##/##/####'"
                    class="custom-text-field"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    v-model="localRecord.email"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    prepend-inner-icon="mdi-email"
                    clearable
                    autocomplete="email"
                    class="custom-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-text-field
                    v-model="localRecord.password"
                    :rules="isEditing ? [] : [rules.required, rules.min, rules.password]"
                    type="password"
                    label="Senha"
                    prepend-inner-icon="mdi-lock"
                    hint="Deve conter: 8 caracteres, maiúscula, minúscula e número"
                    counter
                    autocomplete="current-password"
                    class="custom-text-field"
                  ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-select
                    placeholder="Select..."
                    v-model="localRecord.role"
                    :items="roles"
                    label="Perfil"
                    :rules="[rules.required]"
                    required
                    aria-label="Perfil do usuário"
                    aria-required="true"
                    class="custom-text-field"
                  >
                  </v-select>
                </v-col>
              </v-row>
            </v-form>

            <v-card-actions class="mt-4">
              <v-btn color="secondary" variant="flat" @click="closeDialog">
                <v-icon start>mdi-close</v-icon>
                Cancelar
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                variant="flat"
                @click="validateStep1"
                :disabled="!isStep1Valid"
              >
                Próximo
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>
            </v-card-actions>
          </template>

          <template #item.2>
            <Address
              :itens="localRecord.addresses"
              @update:itens="updateAddresses"
              class="address-container"
            >
            </Address>

            <v-card-actions class="mt-4">
              <v-btn color="secondary" variant="flat" @click="currentStep = 1">
                <v-icon start>mdi-arrow-left</v-icon>
                Voltar
              </v-btn>

              <v-spacer></v-spacer>

              <v-btn
                color="primary"
                variant="flat"
                @click="save"
                :disabled="localRecord.addresses.length === 0"
                :loading="loading"
              >
                <v-icon start>mdi-content-save</v-icon>
                Salvar
              </v-btn>
            </v-card-actions>
          </template>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.full-dialog {
  height: 95vh;
}

.full-height-card {
  display: flex;
  flex-direction: column;
  height: 90vh;
}

.card-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.full-height-stepper {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-card);
}

.v-stepper__content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;
}

.v-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.v-row {
  margin: 0 -12px;
}

.v-col {
  padding: 12px;
  display: flex;
  flex-direction: column;
}

.v-card {
  background-color: var(--color-background-card);
}

.v-card-actions {
  padding: 16px;
  margin-top: auto;
  border-top: 1px solid rgba(var(--color-black), 0.01);
  background-color: rgba(var(--color-black), 0.01);
}

.address-container {
  min-height: 300px;
  max-height: 50vh;
  overflow-y: auto;
  padding: 16px;
  border: 1px solid rgba(var(--color-black), 0.01);
  border-radius: 8px;
}

.custom-text-field {
  color: var(--color-text-input);
}

.custom-text-field :deep(.v-input__control) {
  background-color: var(--color-background-input);
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

@media (max-width: 960px) {
  .v-col {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  .full-height-card {
    height: 95vh;
  }

  .address-container {
    max-height: 40vh;
  }
}
</style>
