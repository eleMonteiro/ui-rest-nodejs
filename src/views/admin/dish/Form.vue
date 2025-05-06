<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  dialog: Boolean,
  isEditing: Boolean,
  record: Object,
  imagePreview: [String, null],
});

const emit = defineEmits(["update:dialog", "update:imageFile", "save", "close", "clear-preview"]);
const localImageFile = ref(null);
const localImagePreview = ref(props.imagePreview);
const CATEGORY_OPTIONS = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "PRATO_PRINCIPAL", label: "Prato Principal" },
  { value: "SOBREMESA", label: "Sobremesa" },
  { value: "BEBIDA", label: "Bebida" },
  { value: "LANCHES", label: "Lanches" },
  { value: "PETISCOS", label: "Petiscos" },
];

watch(localImageFile, (newFile) => {
  if (newFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      localImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(newFile);
  } else {
    if (!props.isEditing) {
      localImagePreview.value = null;
    }
  }
});

watch(
  () => props.imagePreview,
  (newPreview) => {
    if (newPreview) {
      localImagePreview.value = newPreview;
    }
  },
  { immediate: true }
);

const dialogVisible = computed({
  get: () => props.dialog,
  set: (value) => emit("update:dialog", value),
});

const rules = {
  required: (v) => !!v || "Campo obrigatório.",
  minLength: (len) => (v) => (v && v.length >= len) || `Mínimo ${len} caracteres`,
  maxLength: (len) => (v) => (v && v.length <= len) || `Máximo ${len} caracteres`,
  price: (v) => {
    if (!v) return true;
    const num = Number(v);
    return (num >= 0.01 && num <= 9999.99) || "Preço deve ser entre 0.01 e 9999.99";
  },
  imageType: (v) => {
    if (!v) return true;
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    return validTypes.includes(v.type) || "Formato inválido (use JPEG, PNG, GIF ou WebP)";
  },
  imageSize: (v) => {
    if (!v) return true;
    return v.size <= 2 * 1024 * 1024 || "Imagem muito grande (máx. 2MB)";
  },
};

const previewImage = (file) => {
  if (file) {
    localImageFile.value = file;
    emit("update:imageFile", file);
  }
};

const clearImage = () => {
  localImageFile.value = null;
  localImagePreview.value = null;
  emit("update:imageFile", null);
  emit("clear-preview");
};

const save = () => {
  emit("save");
  clearImage();
};

const closeDialog = () => {
  emit("close");
  clearImage();
};
</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="800" persistent @click:outside="closeDialog">
    <v-card :title="`${isEditing ? 'Editar' : 'Adicionar'} um prato`" color="white">
      <template v-slot:text>
        <v-form validate-on="submit">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="record.name"
                label="Nome"
                :rules="[rules.required, rules.minLength(3), rules.maxLength(50)]"
                counter
                clearable
                prepend-inner-icon="mdi-food"
                variant="outlined"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="record.description"
                label="Descrição"
                :rules="[rules.required, rules.minLength(10), rules.maxLength(200)]"
                variant="outlined"
                counter
                clearable
                auto-grow
                rows="3"
                prepend-inner-icon="mdi-text"
              ></v-textarea>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                v-model="record.price"
                type="number"
                label="Preço"
                :rules="[rules.required, rules.price]"
                variant="outlined"
                prepend-inner-icon="mdi-currency-usd"
                step="0.01"
                min="0.01"
                max="9999.99"
                suffix="R$"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-select
                v-model="record.category"
                label="Categoria"
                :items="CATEGORY_OPTIONS"
                item-title="label"
                item-value="value"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-tag"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-file-input
                v-model="localImageFile"
                label="Imagem do prato"
                :rules="[!isEditing || rules.required, rules.imageType, rules.imageSize]"
                accept="image/*"
                prepend-icon=""
                prepend-inner-icon="mdi-image"
                variant="outlined"
                show-size
                counter
                @update:modelValue="previewImage"
                @click:clear="clearImage"
              ></v-file-input>
            </v-col>

            <v-col cols="12" class="d-flex justify-center">
              <template v-if="localImagePreview">
                <v-hover v-slot="{ isHovering, props }">
                  <div v-bind="props" class="image-container">
                    <v-img
                      :src="localImagePreview"
                      max-height="200"
                      max-width="200"
                      contain
                      class="elevation-3 rounded-lg"
                    ></v-img>
                    <v-btn
                      v-if="isHovering"
                      icon="mdi-close"
                      color="error"
                      size="small"
                      class="delete-image-btn"
                      @click="clearImage"
                    ></v-btn>
                  </div>
                </v-hover>
              </template>
              <v-card
                v-else
                height="200"
                width="200"
                class="d-flex align-center justify-center grey lighten-3"
              >
                <v-icon size="64" color="grey">mdi-image-off</v-icon>
              </v-card>
            </v-col>
          </v-row>
        </v-form>
      </template>

      <v-card-actions>
        <v-btn
          text="Cancelar"
          color="error"
          variant="flat"
          @click="closeDialog"
          class="mr-2"
        ></v-btn>

        <v-spacer></v-spacer>

        <v-btn
          text="Salvar"
          color="success"
          variant="flat"
          @click="save"
          :disabled="!record.name || !record.description || !record.price"
        ></v-btn>
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
  background-color: rgba(255, 255, 255, 0.7) !important;
}

.v-text-field,
.v-textarea,
.v-select,
.v-file-input {
  margin-bottom: 12px;
}
</style>
