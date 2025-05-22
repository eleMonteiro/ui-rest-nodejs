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
            <v-icon icon="mdi-tag" size="1.5rem" class="mr-2" color="primary"></v-icon>
            <span>{{ `#${record.id}` }}</span>
          </v-col>
          <v-col cols="12">
            <v-icon icon="mdi-calendar" size="1.5rem" class="mr-2" color="primary"></v-icon>
            <span>
              {{
                `${new Date(record?.dateOfDemand).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}`
              }}
            </span>
          </v-col>
          <v-col cols="12">
            <v-icon icon="mdi-map-marker" size="1.5rem" class="mr-2" color="primary"></v-icon>
            <span>{{ `${record?.address}` }}</span>
          </v-col>
        </v-row>
        <v-row>
          <v-table height="auto" class="table" fixed-header>
            <thead>
              <tr>
                <th class="text">
                  <v-tooltip text="Item" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        icon="mdi-invoice-list"
                        size="1.5rem"
                        class="mr-2"
                        color="primary"
                      ></v-icon>
                    </template>
                  </v-tooltip>
                </th>
                <th class="text">
                  <v-tooltip text="Quantidade" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        icon="mdi-counter"
                        size="1.5rem"
                        class="mr-2"
                        color="primary"
                      ></v-icon>
                    </template>
                  </v-tooltip>
                </th>
                <th class="text">
                  <v-tooltip text="Valor" location="top">
                    <template v-slot:activator="{ props }">
                      <v-icon
                        v-bind="props"
                        icon="mdi-currency-brl"
                        size="1.5rem"
                        class="mr-2"
                        color="primary"
                      ></v-icon>
                    </template>
                  </v-tooltip>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.id">
                <td class="text">
                  {{ item.dish.name }}
                </td>
                <td class="text">
                  {{ item.amount }}
                </td>

                <td class="text">
                  {{ item.totalPrice.toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-row>
      </template>
      <template #actions>
        <v-btn text="Ok" @click="close" color="primary"></v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.text {
  font-size: medium;
}

.valor-total {
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
