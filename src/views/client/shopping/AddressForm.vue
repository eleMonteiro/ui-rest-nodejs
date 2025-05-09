<script setup>
const props = defineProps({
  address: Object,
  isLoadingCep: Boolean,
  disabledFields: Boolean,
});

const emit = defineEmits(["cep-blur"]);
</script>

<template>
  <v-form>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="props.address.cep"
          label="CEP *"
          clearable
          :loading="isLoadingCep"
          :rules="[(v) => !!v || 'CEP é obrigatório', (v) => v.length === 10 || 'CEP inválido']"
          @blur="emit('cep-blur')"
          prepend-inner-icon="mdi-map-marker"
          v-mask="'##.###-###'"
          class="custom-text-field"
        />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.road"
          label="Logradouro *"
          clearable
          prepend-inner-icon="mdi-road"
          class="custom-text-field"
        />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.number"
          label="Número *"
          clearable
          prepend-inner-icon="mdi-numeric"
          class="custom-text-field"
        />
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.complement"
          label="Complemento"
          clearable
          prepend-inner-icon="mdi-home-plus"
          class="custom-text-field"
        />
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.neighborhood"
          label="Bairro *"
          clearable
          prepend-inner-icon="mdi-google-maps"
          class="custom-text-field"
        />
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.city"
          label="Cidade *"
          clearable
          prepend-inner-icon="mdi-city"
          class="custom-text-field"
        />
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.uf"
          label="UF *"
          clearable
          prepend-inner-icon="mdi-map-marker-radius"
          class="custom-text-field"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped>
.custom-text-field {
  color: var(--color-text);
}

.custom-text-field :deep(input) {
  background-color: var(--color-primary);
  color: var(--color-text);
  border: none;
  font-size: 1em;
  font-weight: 200;
}

.custom-text-field :deep(.v-messages__message) {
  color: var(--color-accent);
}
</style>
