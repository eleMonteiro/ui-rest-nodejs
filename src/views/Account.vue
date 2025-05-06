<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const DEFAULT_RECORD = { name: "", password: "", email: "", roles: [{ id: "CLIENTE" }] };

const record = ref(DEFAULT_RECORD);
const showPassword = ref(false);
const form = ref(null);

const rules = {
  required: (v) => !!v || "Campo obrigatório.",
  min: (v) => v.length >= 8 || "Mínimo 8 caracteres",
  name: (v) => (v && v.length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(v)) || "Nome inválido",
  email: (v) => /.+@.+\..+/.test(v) || "E-mail inválido",
  password: (v) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/.test(v) ||
    "Senha deve conter maiúscula, minúscula, número e caractere especial",
};

const create = async () => {
  const { valid } = await form.value.validate();

  if (valid) {
    try {
      const response = await store.dispatch("auth/register", record.value);

      if (response?.success) {
        showMessage(response);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        showMessage(response);
      }
    } catch (error) {
      showMessage(error);
    }
  } else {
    showMessage({
      success: false,
      message: "Preencha todos os campos corretamente.",
    });
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
        <div class="right-inner">
          <v-card width="500" height="auto">
            <template #title>
              <div class="text-title">Cadastre-se</div>
            </template>
            <template #text>
              <v-form ref="form" @submit.prevent="create">
                <v-text-field
                  v-model="record.name"
                  :rules="[rules.required, rules.name]"
                  type="text"
                  label="Nome"
                  autocomplete="name"
                  clearable
                  class="custom-text-field"
                ></v-text-field>

                <v-text-field
                  v-model="record.email"
                  :rules="[rules.required, rules.email]"
                  type="email"
                  label="E-mail"
                  autocomplete="email"
                  clearable
                  class="custom-text-field"
                ></v-text-field>

                <v-text-field
                  v-model="record.password"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min, rules.password]"
                  :type="showPassword ? 'text' : 'password'"
                  label="Senha"
                  hint="Deve conter: maiúscula, minúscula, número e caractere especial"
                  counter
                  @click:append-inner="showPassword = !showPassword"
                  autocomplete="new-password"
                  class="custom-text-field"
                ></v-text-field>
              </v-form>
            </template>

            <v-card-actions>
              <v-btn
                size="large"
                text="Login"
                color="error"
                variant="flat"
                @click="redirectLogin"
              ></v-btn>

              <v-spacer></v-spacer>

              <v-btn
                size="large"
                text="Criar Conta"
                color="success"
                variant="flat"
                @click="create"
              ></v-btn>
            </v-card-actions>
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
  background-color: var(--color-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.right {
  flex: 1;
  display: flex;
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
  gap: 1.5rem;
}

.text-title {
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 2.5rem;
  font-weight: 200;
  color: var(--color-primary);
  text-align: center;
  margin: 0;
}

.v-card {
  width: 100%;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  background-color: transparent;
}

.v-card-actions {
  display: flex;
  justify-content: space-between;
  padding: 0;
  margin-top: 1rem;
}

.custom-text-field {
  color: var(--color-primary);
}

.custom-text-field :deep(input) {
  background-color: var(--color-accent);
  color: var(--color-primary);
  border: none;
  font-size: 1em;
  font-weight: 200;
}

.custom-text-field :deep(.v-messages__message) {
  color: var(--color-primary);
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
