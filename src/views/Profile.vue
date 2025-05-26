<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import Address from "@/views/address/Address.vue";

const store = useStore();
const user = ref({
  id: "",
  cpf: "",
  name: "",
  dateOfBirth: "",
  email: "",
  password: "",
  role: "",
  addresses: [],
});

const userId = ref(null);
const rules = {
  required: (v) => !!v || "Campo obrigatório.",
  min: (v) => v.length >= 8 || "Minimo 8 caracteres",
  cpf: (value) => {
    const digits = value?.replace(/\D/g, "") || "";
    return digits.length === 11 || "CPF deve ter 11 dígitos";
  },
  name: (v) => (v && v.length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(v)) || "Nome inválido",
  email: (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
};

const updateAddresses = (newAddresses) => {
  user.value.addresses = newAddresses;
};

const fetchUser = async (id) => {
  const response = await store.dispatch("user/getUser", id);
  if (response?.success) {
    const userData = store.getters["user/user"];
    userId.value = userData?.id;
    user.value.id = userData?.id;
    user.value.cpf = userData?.cpf;
    user.value.name = userData?.name;
    user.value.dateOfBirth = userData?.dateOfBirth;
    user.value.email = userData?.email;
    user.value.password = userData?.password;
    user.value.role = userData?.role;
    user.value.addresses = userData?.addresses;
  } else {
    user.value = null;
    store.dispatch("snackbar/showSnackbar", {
      text: response?.message,
      color: "error",
    });
  }
};

onMounted(async () => {
  try {
    const response = await store.dispatch("auth/checkTokenValidity");
    if (response?.success) {
      const userAuth = store.getters["auth/user"];
      await fetchUser(userAuth?.userId);
    } else {
      user.value = null;
      store.dispatch("snackbar/showSnackbar", {
        text: response?.message,
        color: "error",
      });
    }
  } catch (error) {
    user.value = null;
    userId.value = null;
    store.dispatch("snackbar/showSnackbar", {
      text: error?.message,
      color: "error",
    });
  }
});

const save = async () => {
  try {
    const response = await store.dispatch("user/updateUser", {
      ...user.value,
      cpf: user?.value?.cpf?.replace(/\D/g, ""),
      dateOfBirth: user?.value?.dateOfBirth,
    });
    if (response?.success) {
      store.dispatch("snackbar/showSnackbar", {
        text: response?.message,
        color: "success",
      });
      await fetchUser(userId.value);
    } else {
      store.dispatch("snackbar/showSnackbar", {
        text: response?.message,
        color: "error",
      });
    }
  } catch (error) {
    store.dispatch("snackbar/showSnackbar", {
      text: error?.message,
      color: "error",
    });
  }
};
</script>

<template>
  <div class="profile-container">
    <v-card class="profile-card">
      <v-card-text class="card-content">
        <v-form class="form-container">
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="user.cpf"
                label="CPF"
                :rules="[rules.required, rules.cpf]"
                required
                maxlength="14"
                clearable
                aria-label="CPF do usuário"
                aria-required="true"
                placeholder="000.000.000-00"
                v-mask="'###.###.###-##'"
                class="custom-text-field"
              >
                <template #prepend>
                  <v-icon color="text">mdi-card-account-details</v-icon>
                </template>
              </v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="user.name"
                label="Nome"
                :rules="[rules.required, rules.name]"
                required
                counter
                clearable
                maxlength="100"
                class="custom-text-field"
              >
                <template #prepend>
                  <v-icon color="text">mdi-account</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="user.email"
                label="Email"
                :rules="[rules.required, rules.email]"
                clearable
                autocomplete="email"
                class="custom-text-field"
              >
                <template #prepend>
                  <v-icon color="text">mdi-email</v-icon>
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="4"> </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div class="address-container">
                <Address
                  is-profile="true"
                  :itens="user.addresses"
                  @update:itens="updateAddresses"
                  class="address-container"
                >
                </Address>
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="card-actions">
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click="save" size="large">
          <v-icon left>mdi-content-save</v-icon>
          Salvar Alterações
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.profile-container {
  width: 100%;
  height: 100%;
  display: flex;
}

.profile-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  height: 100%;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  background-color: var(--color-primary);
}

.tab-header {
  background-color: var(--color-primary);
  color: var(--color-text);
}

.tab-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
}

.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: var(--color-primary);
}

.form-container {
  padding: 24px;
  margin-top: 5px;
  flex: 1;
  border-radius: 5px;
  background-color: var(--color-primary);
}

.address-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 5px;
}

.card-actions {
  background-color: var(--color-primary);
}

.custom-text-field {
  color: var(--color-text-input);
}

.custom-text-field:deep(input) {
  background-color: var(--color-background-input);
  color: var(--color-text-input);
  border: none;
}

.custom-text-field:deep(.v-messages__message) {
  color: var(--color-text-input);
}

.custom-text-field:deep(.v-select__selection) {
  color: var(--color-text-input);
}

.custom-text-field :deep(.v-input__control) {
  background-color: var(--color-background-input);
}
</style>
