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
          v-mask="'##.###-###'"
          class="custom-text-field"
        >
          <template #prepend>
            <v-icon v-if="isLoadingCep" color="text">mdi-loading</v-icon>
            <v-icon color="text" v-else>mdi-map-marker</v-icon>
          </template>
        </v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.road"
          label="Logradouro *"
          class="custom-text-field"
        >
          <template #prepend>
            <v-icon color="text">mdi-road</v-icon>
          </template>
        </v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.number"
          label="Número *"
          class="custom-text-field"
        >
          <template #prepend>
            <v-icon color="text">mdi-numeric</v-icon>
          </template>
        </v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.complement"
          label="Complemento"
          class="custom-text-field"
        >
          <template #prepend>
            <v-icon color="text">mdi-home-plus</v-icon>
          </template>
        </v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.neighborhood"
          label="Bairro *"
          class="custom-text-field"
        >
          <template #prepend>
            <v-icon color="text">mdi-google-maps</v-icon>
          </template>
        </v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.city"
          label="Cidade *"
          class="custom-text-field"
        >
          <template #prepend>
            <v-icon color="text">mdi-city</v-icon>
          </template>
        </v-text-field>
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-text-field
          :disabled="disabledFields"
          v-model="props.address.uf"
          label="UF *"
          class="custom-text-field"
        >
          <template #prepend>
            <v-icon color="text">mdi-map-marker-radius</v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </v-form>
</template>

<style scoped>
.custom-text-field {
  color: var(--color-text-input);
}

.custom-text-field:deep(input) {
  background-color: var(--color-background-input);
  color: var(--color-text-input);
  border: none;
  font-size: 1em;
  font-weight: 200;
}

.custom-text-field:deep(.v-messages__message) {
  color: var(--color-text-input);
}

.custom-text-field:deep(.v-input__control) {
  background-color: var(--color-background-input);
}
</style>
