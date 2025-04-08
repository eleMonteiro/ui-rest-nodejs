<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import { applyCpfMask, validateCpf, formatCpf } from "@/utils/masks";
import Address from "../address/Address.vue";

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

const handleCpfInput = (event) => {
  user.value.cpf = applyCpfMask(event);
};

const handleCpfBlur = () => {
  if (user.value?.cpf) {
    user.value.cpf = validateCpf(user.value.cpf);
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
  <div>
    <v-card height="450" width="100%" class="pa-4" style="max-height: 90vh; overflow-y: auto">
      <v-card-text>
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
                v-model="user.email"
                label="Email"
                :rules="[rules.required, rules.email]"
                variant="solo"
                prepend-inner-icon="mdi-email"
                clearable
                autocomplete="email"
              ></v-text-field>
            </v-col>
            <v-col cols="4"> </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <Address
                :itens="user.addresses"
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

<style scoped></style>
