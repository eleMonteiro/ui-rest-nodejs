<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

const loading = ref({});
const pagination = ref({});
const dishes = ref([]);

const store = useStore();

onMounted(async () => {
  await fetchDishes();
});

async function fetchDishes() {
  try {
    const response = await store.dispatch("dish/getDishes");
    if (response?.success) {
      dishes.value = store.getters["dish/dishes"];
      pagination.value = store.getters["dish/pagination"];
    } else {
      showMessage(response);
    }
  } catch (error) {
    showMessage(error);
  }
}

const showMessage = (response) => {
  const message = response?.success
    ? "Operação realizada com sucesso!"
    : "Erro ao realizar operação!";

  store.dispatch("snackbar/showSnackbar", {
    text: response?.message || message,
    color: response?.success ? "success" : "error",
  });
};

function buyDish(dishId) {
  loading.value[dishId] = true;
  setTimeout(() => {
    loading.value[dishId] = false;
    showMessage({ success: true, message: `Prato ${dishId} adicionado ao carrinho!` });
  }, 2000);
}
</script>

<template>
  <div class="cards-container">
    <div class="content-wrapper">
      <v-row :dense="true">
        <v-col v-for="dish in dishes" :key="dish.id">
          <v-card
            class="card-dish mb-2"
            :disabled="loading[dish.id]"
            :loading="loading[dish.id]"
            height="270"
            width="200"
          >
            <template #loader="{ isActive }">
              <v-progress-linear
                :active="isActive"
                color="deep-purple"
                height="4"
                indeterminate
              ></v-progress-linear>
            </template>
            <v-img
              height="150"
              :src="dish.image"
              :alt="dish.name"
              aspect-ratio="16/9"
              cover
            ></v-img>
            <v-card-title class="dish-title">{{ dish.name }}</v-card-title>
            <v-card-subtitle class="dish-description">{{
              dish.category.toUpperCase()
            }}</v-card-subtitle>

            <v-card-actions>
              <v-chip variant="text">R$ {{ dish.price.toFixed(2) }}</v-chip>
              <v-spacer></v-spacer>
              <v-btn color="primary" icon="mdi-cart-outline" @click="buyDish(dish.id)"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <div class="pagination-wrapper" v-if="dishes.length > 0">
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
.cards-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.pagination-wrapper {
  margin-top: auto;
  display: flex;
  align-self: center;
}

.card-dish {
  background-color: var(--bronze);
  color: var(--white);
}

.dish-title {
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dish-description {
  font-size: 0.8em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
