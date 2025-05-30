<script setup>
import { ref, watch } from "vue";
import { DEMAND_STATUS, DEMAND_DELIVERY_METHOD } from "@/constants/demand";

const emit = defineEmits(["filter"]);

const localFilter = ref({
  id: null,
  dateOfDemand: null,
  deliveryMethod: null,
  status: null,
});
const picker = ref(false);
const date = ref(null);

watch(date, (newDate) => {
  if (newDate) {
    localFilter.value.dateOfDemand = newDate.toISOString().substring(0, 10);
  }
});

watch(
  () => localFilter.value.dateOfDemand,
  (val) => {
    if (val) {
      date.value = new Date(val);
    } else {
      date.value = null;
    }
  }
);

const localFilterIsValid = () => {
  const filter = localFilter.value;
  console.log("localFilterIsValid", filter);
  return (
    (filter.id !== null && String(filter.id).trim() !== "") ||
    (filter.dateOfDemand !== null && filter.dateOfDemand.trim() !== "") ||
    (filter.deliveryMethod !== null && filter.deliveryMethod.trim() !== "") ||
    (filter.status !== null && filter.status !== "")
  );
};

const clearFilters = () => {
  const isValidFilter = localFilterIsValid();
  const clearedFilter = {
    id: null,
    dateOfDemand: null,
    deliveryMethod: null,
    status: null,
  };
  picker.value = false;
  localFilter.value = clearedFilter;
  if (isValidFilter) emit("filter", clearedFilter);
};

const applyFilters = () => {
  const isValidFilter = localFilterIsValid();
  if (isValidFilter) emit("filter", localFilter.value);
};
</script>

<template>
  <div class="container">
    <v-text-field v-model="localFilter.id" label="ID" class="custom-text-field" />

    <v-text-field
      v-model="localFilter.dateOfDemand"
      label="Data do Pedido"
      readonly
      @click="picker = true"
      class="custom-text-field"
    ></v-text-field>

    <v-dialog v-model="picker" width="auto">
      <v-card>
        <v-date-picker v-model="date" @update:model-value="picker = false" />
      </v-card>
    </v-dialog>

    <v-select
      v-model="localFilter.deliveryMethod"
      label="Método de Entrega"
      :items="DEMAND_DELIVERY_METHOD"
      item-title="label"
      item-value="value"
      class="custom-text-field"
    />

    <v-select
      v-model="localFilter.status"
      label="Status"
      :items="DEMAND_STATUS"
      item-title="label"
      item-value="value"
      class="custom-text-field"
    />

    <v-btn
      color="secondary"
      @click="applyFilters"
      prepend-icon="mdi-magnify"
      class="custom-text-field"
    >
      Pesquisar
    </v-btn>

    <v-btn color="primary" @click="clearFilters" prepend-icon="mdi-close" class="custom-text-field">
      Limpar Filtros
    </v-btn>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.custom-text-field :deep(.v-input__control) {
  background-color: var(--color-background-input);
}

.v-card {
  background-color: var(--color-background-card);
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

.custom-text-field :deep(textarea) {
  background-color: var(--color-background-input);
  color: var(--color-text-input);
  border: none;
  font-size: 1em;
  font-weight: 200;
}

.custom-text-field :deep(.v-messages__message) {
  color: var(--color-text-input);
}
</style>
