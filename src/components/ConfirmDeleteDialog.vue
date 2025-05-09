<script setup>
import { computed } from "vue";

const props = defineProps({
  visible: { type: Boolean, default: false },
  text: { type: String, default: "Tem certeza que deseja remover este item?" },
  cancelText: { type: String, default: "Cancelar" },
  confirmText: { type: String, default: "Confirmar" },
  cancelColor: { type: String, default: "primary" },
  confirmColor: { type: String, default: "secondary" },
  width: { type: [String, Number], default: 500 },
  persistent: { type: Boolean, default: false },
});

const emit = defineEmits(["update:visible", "confirm", "cancel"]);

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const handleCancel = () => {
  emit("cancel");
  dialogVisible.value = false;
};

const handleConfirm = () => {
  emit("confirm");
  dialogVisible.value = false;
};
</script>

<template>
  <v-dialog v-model="dialogVisible" :max-width="width" :persistent="persistent">
    <v-card>
      <v-card-text>
        <slot name="text">{{ text }}</slot>
      </v-card-text>

      <slot name="additional-content"></slot>

      <v-card-actions>
        <v-btn :text="cancelText" :color="cancelColor" variant="flat" @click="handleCancel"></v-btn>

        <v-spacer></v-spacer>

        <v-btn
          :text="confirmText"
          :color="confirmColor"
          variant="flat"
          @click="handleConfirm"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card {
  background-color: var(--color-accent);
  color: var(--color-text);
  font-size: 1.5em;
}
</style>
