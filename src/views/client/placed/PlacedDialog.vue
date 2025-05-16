<script setup>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  dialog: {
    type: Boolean,
    required: true,
  },
  record: {
    type: Object,
    required: true,
  },
});

const store = useStore();
const emit = defineEmits(["update:dialog", "close"]);
const dialogVisible = computed({
  get: () => props.dialog,
  set: (value) => emit("update:dialog", value),
});

const items = ref([]);

watch(
  () => props.dialog,
  (visible) => {
    if (visible) {
      fetchItens();
    }
  }
);

const fetchItens = async () => {
  try {
    const response = await store.dispatch("item/getItemByDemand", props.record.id);
    if (response?.success) {
      items.value = store.getters["item/items"];
    } else {
      showMessage(response);
    }
  } catch (error) {
    showMessage(error);
  }
};

const showMessage = (response) => {
  const message = response?.success
    ? "Operação realizada com sucesso!"
    : "Erro ao realizar operação!";

  store.dispatch("snackbar/showSnackbar", {
    text: response?.message || message,
    color: response?.success ? "success" : "error",
  });
};

const close = () => {
  emit("close");
};
</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="800" @click:outside="close">
    <v-card color="bgCard">
      <template #text>
        <v-row dense class="text">
          <v-col cols="12">
            <span>{{ `Número: #${record.id}` }}</span>
          </v-col>
          <v-col cols="12">
            <span>
              {{
                `Data: ${new Date(record?.dateOfDemand).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}`
              }}
            </span>
          </v-col>
          <v-col cols="12">
            <span>{{ `Endereço: ${record?.address}` }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-table height="auto" class="table" fixed-header>
            <thead class="table-header">
              <tr>
                <th>Prato</th>
                <th>Quantidade</th>
                <th>Valor Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td>{{ item.dish.name }}</td>
                <td>{{ item.amount }}</td>
                <td>R$ {{ item.totalPrice.toFixed(2) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-row>
        <v-row class="valor-total">
          <v-col cols="12">
            <span>{{ `Valor Total: R$ ${record?.total?.toFixed(2)}` }}</span>
          </v-col>
        </v-row>
      </template>
      <template #actions>
        <v-btn text="Ok" @click="close" color="primary" variant="tonal"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.text {
  font-size: medium;
}

.valor-total {
  font-size: medium;
  text-align: right;
}

.table {
  max-height: 200px;
  width: 100%;
  background-color: var(--color-background-card);
  color: var(--color-text-input);
  margin-top: 20px;
}

.table thead th {
  background-color: var(--color-background-card) !important;
  text-align: center !important;
}

.table tbody td {
  text-align: center !important;
}
</style>
