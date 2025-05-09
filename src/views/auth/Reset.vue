<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const router = useRouter();
const store = useStore();

const newPassword = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");
const isLoading = ref(false);

onMounted(async () => {
  if (route.query.token) {
    const response = await store.dispatch("auth/validateResetToken", route.query.token);
    if (response?.success) {
      store.dispatch("snackbar/showSnackbar", {
        text: response?.message,
        color: "success",
      });
    }
  } else {
    store.dispatch("snackbar/showSnackbar", {
      text: response?.message,
      color: "error",
    });
  }
});

const resetPassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    store.dispatch("snackbar/showSnackbar", {
      text: "As senhas não coincidem.",
      color: "error",
    });
    return;
  }

  isLoading.value = true;

  const response = await store.dispatch("auth/submitNewPassword", {
    token: route.query.token,
    newPassword: newPassword.value,
  });

  if (response?.success) {
    store.dispatch("snackbar/showSnackbar", {
      text: response?.message,
      color: "success",
    });

    setTimeout(() => router.push("/login"), 1500);
  } else {
    store.dispatch("snackbar/showSnackbar", {
      text: response?.message,
      color: "error",
    });
  }

  isLoading.value = false;
};
</script>

<template>
  <div class="container">
    <div class="right">
      <h1>Redefinir Senha</h1>
      <v-card width="70%" variant="text">
        <v-card-text>
          <v-text-field
            v-model="newPassword"
            type="password"
            label="Nova Senha"
            class="mb-2 custom-text-field"
            required
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            type="password"
            label="Confirmar Senha"
            class="mb-2 custom-text-field"
            required
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn
            size="large"
            color="success"
            variant="flat"
            :disabled="isLoading"
            @click="resetPassword"
          >
            {{ isLoading ? "Alterando..." : "Redefinir" }}
          </v-btn>
        </v-card-actions>
      </v-card>
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
</style>
