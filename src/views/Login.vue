<script setup>
import { ref } from 'vue'

const form = ref(false)
const email = ref('')
const password = ref('')
const loading = ref(false)

const rules = {
  required: v => !!v || 'Campo obrigatório.',
  min: v => v.length >= 8 || 'Minimo 8 caracteres',
}

const showPassword = ref(false)

const onSubmit = () => {
  if (!form.value) return
  loading.value = true
  setTimeout(() => (loading.value = false), 2000)
}
</script>

<template>
  <div>
    <div class="container login">
      <div class="left">
        <img src="../assets/icon-primary.svg" alt="Imagem da Tela de Login">
      </div>
      <div class="right">
        <div>
          <h1>Bem-vindo de volta!</h1>
        </div>
        <div>
          <h2>Ainda não tem uma conta? <a>Cadastre-se</a></h2>
        </div>
        <v-card class="mx-auto px-6 py-8 mt-12 form-container" width="500" height="auto">
          <v-form v-model="form" @submit.prevent="onSubmit">
            <v-text-field v-model="email" :readonly="loading" :rules="[rules.required]" class="mb-2" label="Email"
              bg-color="#ffffff"></v-text-field>

            <v-text-field v-model="password" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]" :type="showPassword ? 'text' : 'password'"
              hint="Pelo menos 8 caracteres" label="Senha" counter @click:append-inner="showPassword = !showPassword"
              bg-color="#ffffff">
            </v-text-field>

            <v-checkbox label="Manter-me conectado" style="color: var(--bronze);"></v-checkbox>

            <v-row>
              <v-col>
                <v-btn :disabled="!form" :loading="loading" size="large" type="submit" variant="elevated" block
                  class="submit-button">
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
  position: absolute;
  z-index: 1;
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
