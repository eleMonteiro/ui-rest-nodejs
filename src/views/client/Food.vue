<script setup>
import { onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import Cookies from "js-cookie";

const errorCache = ref({});
const loading = ref({});
const page = ref(1);
const pagination = ref({});
const dishes = ref([]);

const CATEGORY_OPTIONS = [
  { value: "ENTRADA", label: "Entrada", icon: "mdi-food-variant" },
  { value: "PRATO_PRINCIPAL", label: "Prato Principal", icon: "mdi-silverware-fork-knife" },
  { value: "SOBREMESA", label: "Sobremesa", icon: "mdi-cupcake" },
  { value: "BEBIDA", label: "Bebida", icon: "mdi-glass-cocktail" },
  { value: "LANCHES", label: "Lanches", icon: "mdi-hamburger" },
  { value: "PETISCOS", label: "Petiscos", icon: "mdi-food-drumstick" },
];

const store = useStore();

onMounted(async () => {
  await fetchDishes();
});

watch(page, async () => {
  await fetchDishes();
});

const category = (value) => {
  return (
    CATEGORY_OPTIONS.find((option) => option.value === value) || {
      label: "Nenhuma",
      icon: "mdi-help-circle",
    }
  );
};

const fetchDishes = async () => {
  try {
    const sort = {
      field: "id",
      order: "asc",
    };

    const response = await store.dispatch("dish/getDishes", {
      page: page.value,
      pageSize: 10,
      sort,
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
};
</script>

<template>
  <div class="cards-container">
    <div class="content-wrapper">
      <v-row class="card-row" :dense="true" no-gutters>
        <v-col v-for="dish in dishes" :key="dish.id" align-self="stretch">
          <v-card class="card-dish" :disabled="loading[dish.id]" :loading="loading[dish.id]">
            <template #loader="{ isActive }">
              <v-progress-linear
                :active="isActive"
                color="text"
                height="4"
                indeterminate
              ></v-progress-linear>
            </template>
            <template v-if="!errorCache[dish.id] && dish.image">
              <v-img
                :src="dish.image"
                :alt="dish.name"
                aspect-ratio="16/9"
                class="v-img"
                cover
                @error="handleImageError(dish.id)"
              ></v-img>
            </template>
            <template v-else>
              <div class="icon-content">
                <div class="icon-text">
                  <v-icon :icon="category(dish?.category)?.icon" size="128"></v-icon>
                </div>
              </div>
            </template>

            <v-card-title class="dish-title">{{ dish.name }}</v-card-title>

            <v-card-actions>
              <v-tooltip :text="category(dish?.category)?.label.toUpperCase()" location="top">
                <template v-slot:activator="{ props }">
                  <v-icon
                    v-bind="props"
                    :icon="category(dish?.category)?.icon"
                    class="text-wrap"
                    size="24"
                  ></v-icon>
                </template>
              </v-tooltip>
              <v-spacer></v-spacer>
              <v-chip
                variant="elevated"
                prepend-icon="mdi mdi-currency-brl"
                class="text-wrap price"
              >
                {{ dish?.price?.toFixed(2) }}
              </v-chip>
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

.card-dish {
  background-color: var(--color-background-card);
  color: var(--color-primary);
  display: flex;
  flex-direction: column;

  width: 300px;
  min-height: 250px;
}

.card-dish .v-img {
  flex: 0 0 auto;
  height: 200px;
  mix-blend-mode: multiply;
}

.dish-title {
  font-size: 1rem;
  font-weight: 500;
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
  color: rgba(var(--color-text), 0.7);
}

.text-wrap {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-primary);
}

.price {
  background-color: var(--color-text);
}

.icon-content {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--color-background-card);
}

.icon-text {
  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--color-primary);
}
</style>
