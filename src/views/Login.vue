<script setup>
import { ref } from "vue";
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
      const response = await store.dispatch("auth/login", {
        email: email.value,
        password: password.value,
        stayConnected: stayConnected.value,
      });

      if (response?.success) {
        await store.dispatch("auth/checkTokenValidity");
        const role = store.getters["auth/roleUser"];
        if (role) {
          router.push(role === "ADMIN" ? "/home" : "/home-client");
        } else {
          showMessage({
            message: "Usuário e/ou senha inválidos",
            success: false,
          });
        }
      } else {
        showMessage(response);
      }
    } catch (error) {
      showMessage(error);
    } finally {
      loading.value = false;
    }
  } else {
    showMessage({
      message: "Preencha todos os campos obrigatórios",
      success: false,
    });
    loading.value = false;
  }
};

const rules = {
  required: (v) => !!v || "Campo obrigatório.",
};

const showPassword = ref(false);

const resetPassword = () => {
  router.push("/forgot");
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
  <div>
    <div class="container login">
      <div class="left">
        <img src="../assets/icon-primary.svg" alt="Imagem da Tela de Login" />
      </div>
      <div class="right">
        <div class="right-inner">
          <h1>Bem-vindo de volta!</h1>
          <h2>Ainda não tem uma conta? <router-link to="/account">Cadastre-se</router-link></h2>
          <v-card width="500" height="auto" class="card">
            <v-form v-model="form" @submit.prevent="onSubmit">
              <v-text-field
                v-model="email"
                :readonly="loading"
                :rules="[rules.required]"
                class="mb-2 custom-text-field"
                label="E-mail"
                placeholder="Digite seu e-mail"
                autocomplete="email"
                clearable
                prepend-inner-icon="mdi-email-outline"
                :error-messages="error"
                @focus="error = ''"
              >
                <template #message="{ message }">
                  <span style="color: var(--white)">{{ message }}</span>
                </template>
              </v-text-field>

              <v-text-field
                v-model="password"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required]"
                :type="showPassword ? 'text' : 'password'"
                label="Senha"
                placeholder="Digite sua senha"
                @click:append-inner="showPassword = !showPassword"
                autocomplete="current-password"
                clearable
                prepend-inner-icon="mdi-lock-outline"
                :error-messages="error"
                @focus="error = ''"
                class="custom-text-field"
              >
                <template #message="{ message }">
                  <span style="color: var(--white)">{{ message }}</span>
                </template>
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
                  <v-btn
                    size="large"
                    variant="text"
                    block
                    class="text-button"
                    @click="resetPassword"
                  >
                    Esqueceu a senha?
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  min-height: 100vh;
  width: 100vw;
}

.left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.left img {
  width: 500px;
  height: 500px;
  border-radius: 50%;
}

.right {
  flex: 1;
  display: flex;
  background-color: var(--color-primary);
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
}

.right-inner {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.right-inner h1 {
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--white);
}

.right-inner h2 {
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 18px;
  color: var(--white);
}

.right-inner a {
  color: var(--bronze);
}

.v-card {
  width: 100%;
  padding: 2rem;
  box-shadow: 0 4px 12px var(--white) !important;
  background-color: transparent;
  color: var(--white);
}

.v-card-actions {
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin-top: 1rem;
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

.v-text-field {
  margin-bottom: 16px;
}

.v-field__prepend-inner {
  padding-right: 10px;
}

.v-messages {
  min-height: 22px;
}

.v-field__input::placeholder {
  color: var(--color-primary);
  opacity: 1;
}

.v-field--focused .v-field__outline {
  border-color: var(--color-accent) !important;
}

.custom-text-field {
  color: var(--white);
}

.custom-text-field :deep(input) {
  background-color: var(--color-primary);
  color: var(--white);
  border: none;
  font-size: 1em;
  font-weight: 200;
}

.custom-text-field :deep(.v-messages__message) {
  color: var(--bronze);
}

@media (max-width: 1024px) {
  .text-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .left,
  .right {
    width: 100%;
    padding: 1.5rem;
  }

  .left {
    min-height: 300px;
  }

  .right {
    min-height: auto;
  }

  .right-inner {
    max-width: 100%;
  }

  .text-title {
    font-size: 2rem;
  }

  .v-icon {
    size: 300px !important;
  }
}

@media (max-width: 480px) {
  .text-title {
    font-size: 1.8rem;
  }

  .v-card {
    padding: 1.5rem;
    box-shadow: none !important;
  }
}
</style>
