<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const email = ref("");
const valid = ref(true);

const rules = {
  required: (v) => !!v || "Campo obrigatório.",
};

const isDisabled = computed(() => !email.value.trim());

const create = async () => {
  try {
    if (valid.value) {
      const response = await store.dispatch("auth/resetPassword", email.value);

      if (response?.success) {
        store.dispatch("snackbar/showSnackbar", {
          text: response?.message,
          color: "success",
        });
      } else {
        store.dispatch("snackbar/showSnackbar", {
          text: response?.message,
          color: "error",
        });
      }

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }
  } catch (error) {
    store.dispatch("snackbar/showSnackbar", {
      text: error?.message,
      color: "error",
    });
  }
};

const redirectLogin = () => {
  router.push("/login");
};
</script>

<template>
  <div>
    <div class="container">
      <div class="right">
        <div>
          <h1>Redefinir Senha</h1>
          <h2>
            Esqueceu sua senha? Sem problemas! Informe seu e-mail abaixo e enviaremos um link para
            redefinição de senha.
          </h2>
        </div>
        <v-card width="70%" variant="text">
          <v-card-text>
            <v-text-field
              v-model="email"
              :rules="[rules.required]"
              class="mb-2 custom-text-field"
              label="Email"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn size="large" color="primary" variant="flat" @click="redirectLogin">
              <v-icon icon="mdi mdi-cancel" start />Cancelar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              size="large"
              color="secondary"
              variant="flat"
              @click="create"
              :disabled="isDisabled"
            >
              Enviar
            </v-btn>
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

  justify-content: center;
  align-items: center;
}

.right {
  width: 70%;
  height: 70%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
}

.right h1 {
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 25px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--color-primary);

  text-align: center;
}

.right h2 {
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 15px;
  color: var(--color-primary);
  margin-bottom: 20px;

  text-align: center;
}

.right a {
  color: var(--color-accent);
}

.v-card {
  background-color: transparent;
}

.custom-text-field {
  color: var(--color-text-input);
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

.custom-text-field :deep(.v-input__control) {
  background-color: var(--color-background-input);
}
</style>
