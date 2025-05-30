<script setup>
import { computed } from "vue";
import { formatDate } from "@/utils/format";
import { DEMAND_STATUS } from "@/constants/demand";

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  record: {
    type: Object,
    default: () => ({
      id: null,
      dateOfDemand: null,
      deliveryMethod: null,
      status: null,
      userId: null,
      address: null,
    }),
  },
});

const emit = defineEmits(["update:dialog", "edit", "close"]);

const selectedStatus = computed(() => {
  return (
    DEMAND_STATUS.find((status) => status.value === props.record?.status) ?? {
      label: "Status desconhecido",
      color: "grey",
      icon: "mdi-help",
    }
  );
});

const dialogVisible = computed({
  get: () => props.dialog,
  set: (value) => emit("update:dialog", value),
});

const edit = () => {
  emit("edit");
};

const closeDialog = () => {
  emit("close");
};
</script>
<template>
  <v-dialog v-model="dialogVisible" max-width="800" persistent @click:outside="closeDialog">
    <v-card title="Editar Pedido">
      <template v-slot:text>
        <v-form validate-on="submit">
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="record.id"
                readonly
                label="ID"
                prepend-inner-icon="mdi-identifier"
                class="custom-text-field"
              ></v-text-field>
            </v-col>

            <v-col cols="9">
              <v-text-field
                v-model="record.dateOfDemand"
                :model-value="formatDate(record.dateOfDemand)"
                readonly
                label="Data do Pedido"
                prepend-inner-icon="mdi-calendar"
                class="custom-text-field"
              ></v-text-field>
            </v-col>

            <v-col :cols="record?.address ? 12 : 6">
              <v-text-field
                v-model="record.deliveryMethod"
                readonly
                label="Método de Entrega"
                prepend-inner-icon="mdi-package-variant"
                class="custom-text-field"
              >
              </v-text-field>
            </v-col>

            <v-col v-if="record?.address" cols="12">
              <v-textarea
                v-model="record.address"
                readonly
                label="Endereço"
                prepend-inner-icon="mdi-map-marker"
                auto-grow
                rows="3"
                class="custom-text-field"
              ></v-textarea>
            </v-col>

            <v-col :cols="record?.address ? 12 : 6">
              <v-select
                :readonly="!isEditing"
                v-model="record.status"
                label="Status"
                :items="DEMAND_STATUS"
                item-title="label"
                item-value="value"
                prepend-inner-icon="mdi-tag"
                class="custom-text-field"
              >
                <template v-slot:selection="{ item }">
                  <v-chip
                    :text="selectedStatus?.label"
                    :color="selectedStatus?.color"
                    :icon="selectedStatus?.icon"
                    class="ma-1"
                    variant="flat"
                  ></v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </template>

      <v-card-actions>
        <v-btn color="primary" variant="flat" @click="closeDialog" class="mr-2">
          <v-icon icon="mdi-cancel" start /> Cancelar</v-btn
        >

        <v-spacer></v-spacer>

        <v-btn
          v-if="isEditing"
          color="secondary"
          variant="flat"
          @click="edit"
          :disabled="!record.status"
        >
          <v-icon start icon="mdi-file-edit" /> Editar</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.image-container {
  position: relative;
  transition: all 0.3s ease;
}

.image-container:hover {
  transform: scale(1.02);
}

.delete-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: var(--color-text-input) !important;
}

.custom-text-field :deep(.v-input__control) {
  background-color: var(--color-background-input);
}

.v-text-field,
.v-textarea,
.v-select,
.v-file-input {
  margin-bottom: 12px;
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
