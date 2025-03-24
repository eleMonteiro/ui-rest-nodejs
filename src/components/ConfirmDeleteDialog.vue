<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps(["visible", "text"]);
const emit = defineEmits(["update:visible", "confirm-delete"]);

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});
</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="500">
    <v-card>
      <v-card-text> {{ text }} </v-card-text>
      <v-card-actions>
        <v-btn text="Cancelar" color="error" variant="flat" @click="$emit('close')"></v-btn>

        <v-spacer></v-spacer>

        <v-btn
          text="Remover"
          color="success"
          variant="flat"
          @click="$emit('confirm-delete')"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
