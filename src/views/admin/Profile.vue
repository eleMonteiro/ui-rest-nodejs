<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { validateDate } from "@/utils/validate";
import Address from "../address/Address.vue";

const store = useStore();
const tab = ref("dados-pessoais");
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
const roles = ["ADMIN", "CLIENTE"];

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
    showMessage(response);
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
      showMessage(response);
    }
  } catch (error) {
    user.value = null;
    userId.value = null;
    showMessage(error);
  }
});

const save = async () => {
  try {
    const response = await store.dispatch("user/updateUser", {
      ...user.value,
      cpf: user.value.cpf.replace(/\D/g, ""),
      dateOfBirth: user.value.dateOfBirth,
    });
    if (response?.success) {
      showMessage(response);
      await fetchUser(userId.value);
    } else {
      showMessage(response);
    }
  } catch (error) {
    showMessage(error);
  }
};

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
  <div class="profile-container">
    <v-card class="profile-card">
      <v-tabs v-model="tab" class="tab-header">
        <v-tab value="dados-pessoais">
          <v-icon left>mdi-account</v-icon>
          Dados Pessoais
        </v-tab>
        <v-tab value="enderecos">
          <v-icon left>mdi-map-marker</v-icon>
          Endereços
        </v-tab>
        <v-tab value="seguranca">
          <v-icon left>mdi-lock</v-icon>
          Segurança
        </v-tab>
      </v-tabs>

      <v-card-text class="card-content">
        <v-tabs-window v-model="tab" class="tab-window">
          <v-tabs-window-item value="dados-pessoais" class="tab-content">
            <v-form class="form-container">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="user.cpf"
                    label="CPF"
                    :rules="[rules.required, rules.cpf]"
                    required
                    maxlength="14"
                    class="custom-text-field"
                    v-mask="'###.###.###-##'"
                    clearable
                    density="comfortable"
                  >
                    <template #prepend>
                      <v-icon color="text">mdi-card-account-details</v-icon>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="user.name"
                    label="Nome"
                    :rules="[rules.required, rules.name]"
                    required
                    counter
                    clearable
                    maxlength="100"
                    density="comfortable"
                    class="custom-text-field"
                  >
                    <template #prepend>
                      <v-icon color="text">mdi-account</v-icon>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="user.dateOfBirth"
                    label="Data de Nascimento"
                    :rules="[rules.required, rules.date]"
                    placeholder="DD/MM/AAAA"
                    v-mask="'##/##/####'"
                    clearable
                    density="comfortable"
                    class="custom-text-field"
                  >
                    <template #prepend>
                      <v-icon color="text">mdi-calendar</v-icon>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.email"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    clearable
                    density="comfortable"
                    class="custom-text-field"
                  >
                    <template #prepend>
                      <v-icon color="text">mdi-email</v-icon>
                    </template>
                  </v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-select
                    v-model="user.role"
                    :items="roles"
                    label="Perfil"
                    :rules="[rules.required]"
                    required
                    clearable
                    density="comfortable"
                    class="custom-text-field"
                  >
                    <template #prepend>
                      <v-icon color="text">mdi-account-tie</v-icon>
                    </template>

                    <template #item="{ props: item }">
                      <v-list-item v-bind="item"></v-list-item>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-form>
          </v-tabs-window-item>

          <v-tabs-window-item value="enderecos" class="tab-content">
            <div class="address-container">
              <Address :itens="user.addresses" @update:itens="updateAddresses" />
            </div>
          </v-tabs-window-item>

          <v-tabs-window-item value="seguranca" class="tab-content">
            <v-form class="form-container">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="user.password"
                    :rules="[rules.password]"
                    type="password"
                    label="Nova Senha"
                    hint="Deve conter: 8 caracteres, maiúscula, minúscula, número e caractere especial"
                    counter
                    clearable
                    density="comfortable"
                    class="custom-text-field"
                  >
                    <template #prepend>
                      <v-icon color="text">mdi-lock</v-icon>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>

      <v-card-actions class="card-actions">
        <v-spacer />
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
  color: var(--color-text);
}

.custom-text-field :deep(input) {
  background-color: var(--color-primary);
  color: var(--color-text);
  border: none;
}

.custom-text-field :deep(.v-messages__message) {
  color: var(--color-text);
}

.custom-text-field :deep(.v-select__selection) {
  color: var(--color-text);
}
</style>
