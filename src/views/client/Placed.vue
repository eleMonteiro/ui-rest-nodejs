<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { FORM_PAYMENT } from "@/constants/formPayment";
import { DEMAND_STATUS } from "@/constants/demand";
import { formatMoney, formatDate } from "@/utils/format";
import Dialog from "@/views/client/placed/PlacedDialog.vue";
import useSnackbar from "@/composables/useSnackbar";

const { showMessage } = useSnackbar();

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

const viewRequest = (demand) => {
  loading.value[demand.id] = true;
  setTimeout(() => {
    loading.value[demand.id] = false;
    record.value = demand;
    dialogForm.value = true;
  }, 1000);
};

const formPayment = (demand) => {
  const value = demand?.payment?.method;
  return (
    FORM_PAYMENT.find((option) => option.value === value) || {
      label: "Não identificado",
      icon: "mdi-help-circle",
    }
  );
};

const status = (status) => {
  const value = status;
  return (
    DEMAND_STATUS.find((option) => option.value === value) || {
      label: "Não identificado",
      icon: "mdi-help-circle",
    }
  );
};
</script>

<template>
  <div class="placed-container">
    <div class="cards-container">
      <Dialog :dialog="dialogForm" :record="record" @close="dialogForm = false" />
      <div class="content-wrapper">
        <v-row v-if="demands?.length > 0" class="card-row" :dense="true" no-gutters>
          <v-col v-for="demand in demands" :key="demand.id" align-self="stretch">
            <v-card
              class="card-demand"
              :disabled="loading[demand.id]"
              :loading="loading[demand.id]"
            >
              <template #loader="{ isActive }">
                <v-progress-linear
                  :active="isActive"
                  color="text"
                  height="4"
                  indeterminate
                ></v-progress-linear>
              </template>

              <v-card-title class="demand-text title">
                <v-icon icon="mdi-cart" size="1.5rem" class="mr-2" color="primary"></v-icon>
                Pedido
              </v-card-title>

              <v-card-text class="demand-text">
                <v-icon
                  :icon="status(demand?.status).icon"
                  size="1.5rem"
                  class="mr-2"
                  color="primary"
                ></v-icon>
                {{ status(demand?.status).label }}
              </v-card-text>

              <v-card-subtitle class="demand-text">
                <v-icon icon="mdi-tag" size="1.5rem" class="mr-2" color="primary"></v-icon>
                {{ `#${demand.id}` }}
              </v-card-subtitle>

              <v-card-text class="demand-text">
                <v-icon icon="mdi-calendar" size="1.5rem" class="mr-2" color="primary"></v-icon>
                {{ formatDate(demand?.dateOfDemand) }}
              </v-card-text>
              <v-card-text class="demand-text">
                <v-icon
                  :icon="formPayment(demand)?.icon"
                  size="1.5rem"
                  class="mr-2"
                  color="primary"
                ></v-icon>
                {{ `${formPayment(demand)?.label}` }}
              </v-card-text>

              <v-spacer></v-spacer>

              <v-card-actions class="v-card-actions">
                <v-chip prepend-icon="mdi mdi-currency-brl" variant="flat" class="text-wrap price">
                  {{ `${formatMoney(demand?.total)}` }}
                </v-chip>
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
        <div class="demand-none" v-else>
          <div>Nenhum pedido encontrado.</div>
        </div>
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
  </div>
</template>

<style scoped>
.placed-container {
  flex: 1;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

.cards-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.content-wrapper {
  flex-grow: 1;
  width: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
}

.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.card-row .v-col {
  flex: 1 0 250px;
  max-width: 350px;
  min-width: 250px;
}

.card-demand {
  background-color: var(--color-background-card);
  color: var(--color-primary);
  display: flex;
  flex-direction: column;
  height: 300px;
  width: 100%;
  border-radius: 8px;
}

.card-demand .v-card-title,
.card-demand .v-card-subtitle,
.card-demand .v-card-actions,
.card-demand .v-card-text {
  flex: 0 0 auto;
  padding: 8px 12px;
}

.demand-text {
  font-size: 1rem;
  font-weight: 400;
  display: flex;
  align-items: center;
}

.demand-text.title {
  font-size: 1.2rem;
  font-weight: 500;
}

.text-wrap {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-primary);
  max-width: 100%;
}

.price {
  background-color: var(--color-text);
  color: var(--color-primary);
}

.demand-none {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text);
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  padding: 2rem;
}

.pagination-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 1rem;
  margin-top: auto;
}

@media (max-width: 599px) {
  .card-row .v-col {
    flex: 1 0 100%;
    max-width: 100%;
  }

  .card-demand {
    height: auto;
    min-height: 250px;
  }

  .demand-none {
    font-size: 1.2rem;
  }
}

@media (min-width: 600px) and (max-width: 959px) {
  .card-row .v-col {
    flex: 1 0 calc(50% - 1rem);
  }
}

@media (min-width: 960px) and (max-width: 1263px) {
  .card-row .v-col {
    flex: 1 0 calc(33.333% - 1rem);
  }
}

@media (min-width: 1264px) {
  .card-row .v-col {
    flex: 1 0 calc(25% - 1rem);
  }
}
</style>
