<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { applyCpfMask, validateCpf, formatCpf, applyDateMask, validateDate } from "@/utils/masks";
import Address from "./user/address/Address.vue";

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

const handleCpfInput = (event) => {
  user.value.cpf = applyCpfMask(event);
};

const handleCpfBlur = () => {
  if (user.value?.cpf) {
    user.value.cpf = validateCpf(user.value.cpf);
  }
};

const handleDateInput = (event) => {
  user.value.dateOfBirth = applyDateMask(event);
};

const handleValidateDate = () => {
  if (!validateDate(user.value.dateOfBirth)) {
    user.value.dateOfBirth = "";
  }
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
    user.value.cpf = formatCpf(userData?.cpf);
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
      await fetchUser(userAuth?.id);
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
      cpf: user.value.cpf.replace(/\D/g, ""),
      dateOfBirth: user.value.dateOfBirth,
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
  <div class="content">
    <v-card width="100%" max-height="100%" class="d-flex flex-column">
      <v-card-title style="margin-bottom: 20px"> Dados do Usuário </v-card-title>
      <v-card-text scrollable>
        <v-form class="mb-4">
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="user.cpf"
                label="CPF"
                :rules="[rules.required, rules.cpf]"
                variant="solo"
                @input="handleCpfInput"
                @blur="handleCpfBlur"
                required
                maxlength="14"
                prepend-inner-icon="mdi-card-account-details"
                clearable
                aria-label="CPF do usuário"
                aria-required="true"
                placeholder="000.000.000-00"
              ></v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="user.name"
                label="Nome"
                :rules="[rules.required, rules.name]"
                variant="solo"
                required
                prepend-inner-icon="mdi-account"
                counter
                clearable
                maxlength="100"
              ></v-text-field>
            </v-col>

            <v-col cols="4">
              <v-text-field
                v-model="user.dateOfBirth"
                label="Data de Nascimento"
                :rules="[rules.required, rules.date]"
                variant="solo"
                prepend-inner-icon="mdi-calendar"
                placeholder="DD/MM/AAAA"
                @input="handleDateInput"
                @blur="handleValidateDate"
                clearable
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="user.email"
                label="Email"
                :rules="[rules.required, rules.email]"
                variant="solo"
                prepend-inner-icon="mdi-email"
                clearable
                autocomplete="email"
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="user.password"
                :rules="[]"
                type="password"
                label="Senha"
                variant="solo"
                prepend-inner-icon="mdi-lock"
                hint="Deve conter: 8 caracteres, maiúscula, minúscula e número"
                counter
                autocomplete="current-password"
                clearable
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="user.role"
                placeholder="Select..."
                :items="roles"
                label="Perfil"
                :rules="[rules.required]"
                variant="solo"
                required
                aria-label="Perfil do usuário"
                aria-required="true"
                clearable
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <Address
                :itens="user.addresses"
                :headers="headers"
                @update:itens="updateAddresses"
                class="address-container"
              >
              </Address>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="flat" @click="save">
          <v-icon left>mdi-content-save</v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
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
</style>
