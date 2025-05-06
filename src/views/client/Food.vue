<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import Cookies from "js-cookie";
import noneImg from "../../assets/none-img.png";

const defaultImg = ref(noneImg);
const errorCache = ref({});
const loading = ref({});
const page = ref(1);
const pagination = ref({});
const dishes = ref([]);

const store = useStore();

onMounted(async () => {
  await fetchDishes();
});

watch(page, async () => {
  await fetchDishes();
});

const fetchDishes = async () => {
  try {
    const response = await store.dispatch("dish/getDishes", {
      page: page.value,
      pageSize: 10,
    });
    if (response?.success) {
      dishes.value = store.getters["dish/dishes"];
      pagination.value = store.getters["dish/pagination"];
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

const buyDish = (dishId) => {
  loading.value[dishId] = true;

  const dish = dishes.value.find((d) => d.id === dishId);
  if (!dish) return;

  setTimeout(() => {
    loading.value[dishId] = false;
    addToCart(dish);
    showMessage({ success: true, message: `Dish ${dish.name} added to the cart!` });
  }, 500);
};

const addToCart = (dish) => {
  let cart = JSON.parse(Cookies.get("cart") || "[]");

  const existing = cart.find((item) => item.dishId === dish.id);

  if (existing) {
    existing.amount++;
    existing.totalPrice = existing.amount * dish.price;
  } else {
    cart.push({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      amount: 1,
      totalPrice: dish.price,
    });
  }

  Cookies.set("cart", JSON.stringify(cart), { expires: 7 });
};

const handleImageError = (dishId) => {
  errorCache.value[dishId] = true;
  return defaultImg;
};
</script>

<template>
  <div class="cards-container">
    <div class="content-wrapper">
      <v-row class="card-row" :dense="true">
        <v-col v-for="dish in dishes" :key="dish.id" cols="12" md="3">
          <v-card class="card-dish" :disabled="loading[dish.id]" :loading="loading[dish.id]">
            <template #loader="{ isActive }">
              <v-progress-linear
                :active="isActive"
                color="deep-purple"
                height="4"
                indeterminate
              ></v-progress-linear>
            </template>
            <v-img
              :src="errorCache[dish.id] || !dish.image ? defaultImg : dish.image"
              :alt="dish.name"
              aspect-ratio="16/9"
              class="v-img"
              cover
              @error="handleImageError(dish.id)"
            ></v-img>
            <v-card-title class="dish-title">{{ dish.name }}</v-card-title>

            <v-card-actions class="v-card-actions">
              <v-chip variant="flat" color="primary">{{ dish?.category?.toUpperCase() }}</v-chip>
              <v-spacer></v-spacer>
              <v-chip variant="flat" color="secondary">R$ {{ dish?.price?.toFixed(2) }}</v-chip>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="text-button"
                icon="mdi-cart-outline"
                @click="buyDish(dish.id)"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <div class="pagination-wrapper" v-if="dishes?.length > 0">
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
  justify-content: flex-start;
  align-items: stretch;
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  width: 100%;
}

.pagination-wrapper {
  display: flex;
  align-self: center;
  margin-top: 16px;
}

.content-wrapper > .card-row {
  min-height: 400px;
  overflow-y: auto;
  display: flex;
  justify-content: center;
}

.card-dish {
  background-color: var(--bronze);
  color: var(--white);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-dish .v-img {
  flex: 0 0 auto;
  height: 150px;
}

.card-dish .v-card-title,
.card-dish .v-card-subtitle,
.card-dish .v-card-actions {
  flex: 0 0 auto;
  padding: 8px 12px;
}

.dish-title {
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.dish-description {
  font-size: 0.8em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(255, 255, 255, 0.7);
}
</style>
