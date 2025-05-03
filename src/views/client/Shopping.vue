<script setup>
import { ref, onMounted } from "vue";
import Cookies from "js-cookie";

const DEFAULT_DEMAND = ref({
  total: 0,
  address: null,
  items: {
    dishId: 0,
    amount: 0,
    totalPrice: 0,
  },
});

const cartItems = ref([]);
const headers = [
  { title: "ID", key: "dishId", align: "center" },
  { title: "Dish", key: "name", align: "center" },
  { title: "Quantity", key: "amount", align: "center" },
  { title: "Price", key: "price", align: "center" },
  { title: "Total Value", key: "total", align: "center" },
  { title: "", key: "actions", sortable: false, align: "center" },
];

onMounted(() => {
  loadCart();
});

const loadCart = () => {
  const cookieCart = Cookies.get("cart");
  cartItems.value = cookieCart ? JSON.parse(cookieCart) : [];
  DEFAULT_DEMAND.value.items = cartItems.value;
  DEFAULT_DEMAND.value.total = cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0);
};

const removeItem = (dishId) => {
  cartItems.value = cartItems.value.filter((item) => item.dishId !== dishId);
  Cookies.set("cart", JSON.stringify(cartItems.value), { expires: 7 });

  DEFAULT_DEMAND.value.items = cartItems.value;
  DEFAULT_DEMAND.value.total = cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0);
};

const finishBuy = () => {
  console.log("Sending demand:", DEFAULT_DEMAND.value);
};
</script>

<template>
  <div>
    <v-data-table
      :headers="headers"
      :hide-default-footer="cartItems.length < 11"
      :items="cartItems"
      class="table"
    >
      <template #top>
        <v-toolbar class="header-table">
          <v-toolbar-title> Shopping Cart </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-btn
            :disabled="cartItems?.length > 0 ? false : true"
            variant="outlined"
            color="bronze"
            @click="finishBuy"
            >Checkout</v-btn
          >
        </v-toolbar>
      </template>

      <template v-slot:item.total="{ item }">
        R$ {{ (item.price * item.amount).toFixed(2) }}
      </template>

      <template v-slot:item.actions="{ item }">
        <div class="d-flex ga-2 justify-end">
          <v-tooltip text="Excluir" location="top">
            <template #activator="{ props }">
              <v-icon
                color="white"
                icon="mdi-delete"
                size="small"
                @click="removeItem(item.dishId)"
                v-bind="props"
              ></v-icon>
            </template>
          </v-tooltip>
        </div>
      </template>

      <template #bottom>
        <v-toolbar class="footer-table">
          Total: R$ {{ cartItems.reduce((sum, i) => sum + i.price * i.amount, 0).toFixed(2) }}
        </v-toolbar>
      </template>
    </v-data-table>
  </div>
</template>

<style scoped>
.table {
  width: 100%;
  height: 100%;

  background-color: transparent;
  color: var(--white);
}

.header-table {
  background-color: transparent;
  color: var(--white);
  text-align: center;
}

.footer-table {
  background-color: transparent;
  color: var(--white);
  text-align: center;
  font-weight: 200;
  font-size: 1.5em;
}
</style>
