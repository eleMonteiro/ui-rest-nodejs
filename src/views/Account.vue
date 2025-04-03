<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const DEFAULT_RECORD = { name: "", password: "", email: "", roles: [{ id: "CLIENTE" }] };

const record = ref(DEFAULT_RECORD);
const showPassword = ref(false);
const valid = ref(true);

const rules = {
  required: (v) => !!v || "Campo obrigatório.",
  min: (v) => v.length >= 8 || "Minimo 8 caracteres",
};

const create = async () => {
  try {
    if (valid.value) {
      await store.dispatch("auth/register", record.value);
      redirectLogin();
    }
  } catch (error) {}
};

const redirectLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div>
    <div class="container login">
      <div class="left">
        <v-icon class="mdi mdi-account" color="white" size="500"></v-icon>
      </div>
      <div class="right">
        <v-card width="500" height="auto" variant="text">
          <template #title>
            <div class="text-center">Cadastre-se</div>
          </template>
          <template #text>
            <v-text-field
              v-model="record.name"
              :rules="[rules.required]"
              label="Nome"
              bg-color="white"
            ></v-text-field>

            <v-text-field
              v-model="record.email"
              :rules="[rules.required]"
              label="Email"
              bg-color="white"
            ></v-text-field>

            <v-text-field
              v-model="record.password"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="showPassword ? 'text' : 'password'"
              hint="Pelo menos 8 caracteres"
              label="Senha"
              @click:append-inner="showPassword = !showPassword"
              bg-color="white"
            >
            </v-text-field>
          </template>

          <v-card-actions>
            <v-btn
              size="large"
              text="Criar Conta"
              color="success"
              variant="flat"
              @click="create"
            ></v-btn>

            <v-spacer></v-spacer>

            <v-btn
              size="large"
              text="Login"
              color="error"
              variant="flat"
              @click="redirectLogin"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.left {
  flex: 1;
  background-color: var(--color-primary);
}

.right {
  flex: 1;
}

.left,
.right {
  width: 50%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right {
  flex-direction: column;
}

.left img {
  width: 500px;
  height: 500px;
  border-radius: 50%;
  position: absolute;
  z-index: 1;
}

.text-center {
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 50px;
  font-weight: 200;
  margin-bottom: 20px;
  color: var(--color-primary);
}

.right a {
  color: var(--bronze);
}

.v-card {
  background-color: transparent !important;
}
</style>
