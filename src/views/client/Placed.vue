<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import Dialog from "@/views/client/placed/PlacedDialog.vue";

const loading = ref({});
const page = ref(1);
const pagination = ref({});
const demands = ref([]);
const dialogForm = ref(false);
const record = ref({});

const store = useStore();

onMounted(async () => {
  await fetchDemands();
});

watch(page, async () => {
  await fetchDemands();
});

const fetchDemands = async () => {
  try {
    const user = store.getters["user/user"];
    const response = await store.dispatch("demand/getDemandByUser", {
      userId: user?.id,
      page: page.value,
      pageSize: 10,
    });

    if (response?.success) {
      demands.value = store.getters["demand/demands"];
      pagination.value = store.getters["demand/pagination"];
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

const viewRequest = (demand) => {
  loading.value[demand.id] = true;
  setTimeout(() => {
    loading.value[demand.id] = false;
    record.value = demand;
    dialogForm.value = true;
  }, 1000);
};

const formPayment = (demand) => {
  return demand?.payment?.method || "PAGAMENTO";
}
</script>

<template>
  <div class="cards-container">
    <Dialog :dialog="dialogForm" :record="record" @close="dialogForm = false" />
    <div class="content-wrapper">
      <v-row class="card-row" :dense="true" no-gutters>
        <v-col v-for="demand in demands" :key="demand.id" align-self="stretch">
          <v-card class="card-demand" :disabled="loading[demand.id]" :loading="loading[demand.id]">
            <template #loader="{ isActive }">
              <v-progress-linear
                :active="isActive"
                color="text"
                height="4"
                indeterminate
              ></v-progress-linear>
            </template>

            <v-card-title class="demand-title">
              {{ `Número do Pedido: #${demand.id}` }}
            </v-card-title>
            <v-card-text class="demand-text">
              {{ `Data do Pedido: ${new Date(demand?.dateOfDemand).toLocaleDateString("pt-BR")}` }}
            </v-card-text class="demand-text">
            <v-card-text>
              {{ `Forma de Pagamento: ${formPayment(demand)}` }}
            </v-card-text>

            <v-card-actions class="v-card-actions">
              <v-chip variant="flat" color="secondary">{{
                `R$ ${demand?.total?.toFixed(2)}`
              }}</v-chip>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="text-button"
                icon="mdi mdi-magnify-expand"
                @click="viewRequest(demand)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div class="pagination-wrapper" v-if="demands?.length > 0">
      <v-pagination
        v-model="page"
        :length="pagination.totalPages"
        :total-visible="pagination.total"
        rounded="circle"
      ></v-pagination>
    </div>
  </div>
</template>

<style scoped>
.cards-container {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.card-row {
  gap: 1rem;
  width: 100%;

  justify-content: space-evenly;
}

.card-row .v-col {
  max-width: 300px;
}

.card-demand {
  background-color: var(--color-accent);
  color: var(--color-text);
  display: flex;
  flex-direction: column;

  width: 250px;
  min-height: 200px;
}

.card-demand .v-card-title,
.card-demand .v-card-subtitle,
.card-demand .v-card-actions,
.card-demand .v-card-text {
  flex: 0 0 auto;
  padding: 8px 12px;
}

.demand-title {
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.demand-text {
  font-size: 0.8em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(var(--color-text), 0.7);
}
</style>
