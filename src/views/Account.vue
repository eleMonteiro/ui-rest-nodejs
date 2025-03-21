<script setup>
import { ref } from 'vue'

const form = ref(false)
const name = ref('')
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
        <v-icon class="mdi mdi-account" color="white" size="500"></v-icon>
      </div>
      <div class="right">
        <div class="text-center">
          <h1>Cadastre-se</h1>
        </div>
        <v-card class="mx-auto px-6 py-8 mt-2 form-container" width="500" height="auto">
          <v-form v-model="form" @submit.prevent="onSubmit">
            <v-text-field v-model="name" :readonly="loading" :rules="[rules.required]" class="mb-4" label="Nome"
              bg-color="#ffffff"></v-text-field>

            <v-text-field v-model="email" :readonly="loading" :rules="[rules.required]" class="mb-4" label="Email"
              bg-color="#ffffff"></v-text-field>

            <v-text-field v-model="password" :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rules.required, rules.min]" :type="showPassword ? 'text' : 'password'"
              hint="Pelo menos 8 caracteres" label="Senha" counter @click:append-inner="showPassword = !showPassword"
              bg-color="#ffffff" class="mb-12">
            </v-text-field>

            <v-row>
              <v-col cols="6">
                <v-btn :disabled="!form" :loading="loading" size="large" type="submit" variant="elevated" block
                  class="submit-button">
                  Criar Conta
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

.right h1 {
  font-family: "Be Vietnam Pro", sans-serif;
  font-size: 50px;
  font-weight: 200;
  margin-bottom: 20px;
  color: var(--color-primary);
}

.text-center {
  width: 50%;
  height: auto;
  position: relative;
  display: flex;
  justify-content: left;
  align-items: center;
}

.right a {
  color: var(--bronze);
}

.submit-button {
  background-color: var(--color-primary);
  color: var(--color-accent);
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
