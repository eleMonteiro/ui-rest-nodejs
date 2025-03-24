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
  imagePreview: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:dialog", "save", "close", "preview-image"]);

const dialogVisible = computed({
  get: () => props.dialog,
  set: (value) => emit("update:dialog", value),
});

const rules = {
  required: (v) => !!v || "Campo obrigatório.",
};

const previewImage = (event) => {
  const file = event.target.files[0];
  if (file) {
    emit("preview-image", file);
  }
};

const save = () => {
  emit("save");
};

const closeDialog = () => {
  emit("close");
};
</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="800">
    <v-card :title="`${isEditing ? 'Editar' : 'Adicionar'} um prato`" color="white">
      <template v-slot:text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="record.name"
              label="Nome"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="record.description"
              label="Descrição"
              :rules="[rules.required]"
              variant="solo"
            ></v-textarea>
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="record.price"
              type="number"
              label="Preço"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-row>
            <v-col :cols="imagePreview ? 10 : 12">
              <v-file-input
                label="Imagem"
                :rules="[rules.required]"
                variant="solo"
                @change="previewImage"
              ></v-file-input>
            </v-col>

            <v-col cols="2" class="d-flex align-center">
              <v-img
                v-if="imagePreview || record.image"
                :src="imagePreview || record.image + '?t=' + Date.now()"
                :key="imagePreview || record.image"
                max-height="100"
                max-width="100"
                contain
              ></v-img>
            </v-col>
          </v-row>
        </v-row>
      </template>

      <v-card-actions>
        <v-btn text="Cancelar" color="error" variant="flat" @click="closeDialog"></v-btn>

        <v-spacer></v-spacer>

        <v-btn text="Salvar" color="success" variant="flat" @click="save"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
