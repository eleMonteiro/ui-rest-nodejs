<script setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const props = defineProps({
  to: String,
  invalidToken: Boolean,
});

const form = ref(false);
const valid = ref(true);
const loading = ref(false);
const email = ref("");
const password = ref("");
const stayConnected = ref(false);
const error = ref("");

const store = useStore();
const router = useRouter();

const onSubmit = async () => {
  loading.value = true;
  if (valid.value) {
    try {
      await store.dispatch("auth/login", {
        email: email.value,
        password: password.value,
        stayConnected: stayConnected.value,
      });
      const role = store.getters["auth/roleUser"];
      if (role) {
        router.push(role === "ADMIN" ? "/home" : "/");
      } else {
        error.value = "Usuário e/ou senha inválidos";
      }
    } catch (error) {
      error.value = "Erro ao fazer login";
    } finally {
      loading.value = false;
    }
  }
};

onMounted(async () => {
  const isValid = await store.dispatch("auth/checkTokenValidity");
  if (!isValid) {
    error.value = "Sua sessão expirou. Faça login novamente";
    store.commit("auth/CLEAR_USER");
    router.push("/login");
  } else {
    const role = store.getters["auth/roleUser"];
    router.push(role === "admin" ? "/home" : "/");
  }
});

const rules = {
  required: (v) => !!v || "Campo obrigatório.",
  min: (v) => v.length >= 8 || "Minimo 8 caracteres",
};

const showPassword = ref(false);
</script>

<template>
  <div>
    <div class="container login">
      <div class="left">
        <img src="../assets/icon-primary.svg" alt="Imagem da Tela de Login" />
      </div>
      <div class="right">
        <div>
          <h1>Bem-vindo de volta!</h1>
        </div>
        <div>
          <h2>Ainda não tem uma conta? <router-link to="/account">Cadastre-se</router-link></h2>
        </div>
        <v-card width="500" height="auto" variant="text">
          <v-form v-model="form" @submit.prevent="onSubmit">
            <v-text-field
              v-model="email"
              :readonly="loading"
              :rules="[rules.required]"
              class="mb-2"
              label="Email"
              bg-color="#ffffff"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]"
              :type="showPassword ? 'text' : 'password'"
              hint="Pelo menos 8 caracteres"
              label="Senha"
              counter
              @click:append-inner="showPassword = !showPassword"
              bg-color="#ffffff"
            >
            </v-text-field>

            <v-checkbox
              v-model="stayConnected"
              label="Manter-me conectado"
              style="color: var(--bronze)"
            ></v-checkbox>

            <v-row>
              <v-col>
                <v-btn
                  :disabled="!form"
                  :loading="loading"
                  size="large"
                  type="submit"
                  variant="elevated"
                  block
                  class="submit-button"
                >
                  Acessar
                </v-btn>
              </v-col>
              <v-col>
                <v-btn size="large" type="submit" variant="text" block class="text-button">
                  Esqueceu a senha?
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
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
}

.right {
  flex: 1;
  background-color: var(--color-primary);
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
}

.right h1 {
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--white);
}

.right h2 {
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 18px;
  color: var(--white);
}

.right a {
  color: var(--bronze);
}

.submit-button {
  background-color: var(--color-accent);
  color: var(--color-primary);
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.text-button {
  color: var(--color-accent);
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 18px;
  font-weight: 700;
}

.text-button:hover {
  text-decoration: underline;
}

.form-container {
  background-color: var(--white);
}

.v-card {
  background-color: transparent !important;
}

.v-form {
  background-color: transparent;
}
</style>
