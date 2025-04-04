<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog.vue";
import Table from "./Table.vue";
import Form from "./Form.vue";

const store = useStore();

const DEFAULT_RECORD = { name: "", description: "", category: "", price: "", image: "" };

const itens = ref([]);
const record = ref({ ...DEFAULT_RECORD });
const recordId = ref(null);
const valid = ref(true);

const imagePreview = ref(null);

const dialogForm = ref(false);
const isEditing = ref(false);
const dialogDelete = ref(false);

const headers = [
  { title: "ID", key: "id", align: "start" },
  { title: "Nome", key: "name" },
  { title: "Descrição", key: "description" },
  { title: "Categoria", key: "category" },
  { title: "Preço", key: "price" },
  { title: "", key: "actions", align: "end", sortable: false },
];

onMounted(async () => {
  reset();
  fetchDishes();
});

const fetchDishes = async () => {
  try {
    const response = await store.dispatch("dish/getDishes");
    if (response?.success) {
      store.dispatch("snackbar/showSnackbar", {
        text: response?.message,
        color: "success",
      });
      itens.value = store.getters["dish/dishes"];
    } else {
      store.dispatch("snackbar/showSnackbar", {
        text: response?.message,
        color: "error",
      });
    }
  } catch (error) {
    store.dispatch("snackbar/showSnackbar", {
      text: error?.message,
      color: "error",
    });
  }
};

const add = () => {
  isEditing.value = false;
  record.value = { ...DEFAULT_RECORD };
  dialogForm.value = true;
};

const edit = (id) => {
  isEditing.value = true;
  imagePreview.value = null;
  store.dispatch("dish/getDish", id).then(() => {
    record.value = { ...store.getters["dish/dish"] };
    dialogForm.value = true;
  });
};

const del = (id) => {
  recordId.value = id;
  dialogDelete.value = true;
};

const remove = async () => {
  try {
    const response = await store.dispatch("dish/deleteDish", recordId.value);
    if (response?.success) {
      store.dispatch("snackbar/showSnackbar", {
        text: response?.message,
        color: "success",
      });
      dialogDelete.value = false;
      fetchDishes();
    } else {
      store.dispatch("snackbar/showSnackbar", {
        text: response?.message,
        color: "error",
      });
    }
  } catch (error) {
    store.dispatch("snackbar/showSnackbar", {
      text: error?.message,
      color: "error",
    });
  }
};

const save = async () => {
  try {
    if (valid.value) {
      if (isEditing.value) {
        const response = await store.dispatch("dish/updateDish", record.value);

        if (response?.success) {
          store.dispatch("snackbar/showSnackbar", {
            text: response?.message,
            color: "success",
          });
          reset();
          fetchDishes();
        } else {
          store.dispatch("snackbar/showSnackbar", {
            text: response?.message,
            color: "error",
          });
        }
      } else {
        const response = await store.dispatch("dish/createDish", record.value);
        if (response?.success) {
          store.dispatch("snackbar/showSnackbar", {
            text: response?.message,
            color: "success",
          });
          reset();
          fetchDishes();
        } else {
          store.dispatch("snackbar/showSnackbar", {
            text: response?.message,
            color: "error",
          });
        }
      }
    } else {
      store.dispatch("snackbar/showSnackbar", {
        text: "Preencha todos os campos corretamente.",
        color: "error",
      });
    }
  } catch (error) {
    store.dispatch("snackbar/showSnackbar", {
      text: error?.message,
      color: "error",
    });
  }
};

const closeDialogForm = () => {
  dialogForm.value = false;
};

const reset = () => {
  dialogForm.value = false;
  record.value = { ...DEFAULT_RECORD };
  isEditing.value = false;
  imagePreview.value = null;
  recordId.value = null;
  valid.value = true;
};

watch(
  () => record.value.image,
  (newVal) => {
    if (newVal) {
      if (typeof newVal === "string") {
        imagePreview.value = newVal;
      } else if (newVal instanceof File) {
        imagePreview.value = URL.createObjectURL(newVal);
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="content">
    <Table :itens="itens" :headers="headers" @add="add" @edit="edit" @delete="del" @reset="reset" />

    <Form
      v-model:dialog="dialogForm"
      :isEditing="isEditing"
      :record="record"
      :imagePreview="imagePreview"
      @save="save"
      @close="closeDialogForm"
    />

    <ConfirmDeleteDialog
      :visible="dialogDelete"
      text="Deseja realmente remover este prato?"
      @close="dialogDelete = false"
      @confirm-delete="remove"
    />
  </div>
</template>

<style scoped>
.content {
  width: 90%;
  height: 90%;
  background-color: var(--color-primary);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  border-radius: 10px;
}

.alert {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  height: auto;
  z-index: 1000;
}
</style>
