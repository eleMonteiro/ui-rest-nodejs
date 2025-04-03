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

      store.dispatch("snackbar/showSnackbar", {
        text: response?.message,
        color: "success",
      });

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
              class="mb-2"
              label="Email"
              bg-color="#ffffff"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-btn size="large" color="error" variant="flat" @click="redirectLogin">
              Cancelar
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              size="large"
              color="success"
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

  background-color: var(--white);
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
  color: var(--bronze);
}

.form-container {
  background-color: var(--white);
}
</style>
