<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  dialog: {
    type: Boolean,
    required: true,
  },
  isEditing: {
    type: Boolean,
    required: true,
  },
  record: {
    type: Object,
    required: true,
  },
  recordAddress: {
    type: Object,
    required: true,
  },
  recordRole: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:dialog", "save", "close"]);

const dialogVisible = computed({
  get: () => props.dialog,
  set: (value) => emit("update:dialog", value),
});

const disabled = computed(() => {
  return e1.value === 1 ? "prev" : e1.value === steps.value ? "next" : undefined;
});

const save = () => {
  emit("save");
};

const closeDialog = () => {
  emit("close");
};
</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="800">
    <v-card :title="`${isEditing ? 'Editar' : 'Adicionar'} um usuário`" color="white">
      <template v-slot:text>
        <v-container>
          <v-row justify="center">
            <v-col cols="12">
              <v-stepper v-model="e1" flat>
                <template v-slot:default="{ prev, next }">
                  <v-stepper-header flat elevation="0" class="stepper-header-flat">
                    <template v-for="n in 3" :key="`${n}-step`">
                      <v-stepper-item
                        :complete="1 > n"
                        :step="`Step {{ n }}`"
                        :value="n"
                        editable
                      ></v-stepper-item>

                      <v-divider v-if="n !== 3" :key="n"></v-divider>
                    </template>
                  </v-stepper-header>

                  <v-stepper-window>
                    <v-stepper-window-item :value="1">
                      <v-card color="grey-lighten-1" height="200"> </v-card>
                    </v-stepper-window-item>

                    <v-stepper-window-item :value="2">
                      <v-card color="grey-lighten-2" height="200"> </v-card>
                    </v-stepper-window-item>

                    <v-stepper-window-item :value="3">
                      <v-card color="grey-lighten-3" height="200"> </v-card>
                    </v-stepper-window-item>
                  </v-stepper-window>

                  <v-stepper-actions
                    :disabled="disabled"
                    @click:next="next"
                    @click:prev="prev"
                  ></v-stepper-actions>
                </template>
              </v-stepper>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <v-card-actions>
        <v-btn text="Cancelar" color="error" variant="flat" @click="closeDialog"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Salvar" color="success" variant="flat" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.stepper-header-flat {
  background: transparent !important;
  box-shadow: none !important;
  border-bottom: none !important;
}
</style>
