<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { useStore } from "vuex";
import { FORM_PAYMENT } from "@/constants/formPayment";
import { formatMoney } from "@/utils/format";
import { encryptCart, decryptCart } from "@/utils/crypto";
import Itens from "@/views/client/shopping/Itens.vue";
import Address from "@/views/client/shopping/Address.vue";
import Cookies from "js-cookie";
import Payment from "@/views/client/shopping/Payment.vue";
import useSnackbar from "@/composables/useSnackbar";

const { showMessage } = useSnackbar();

const store = useStore();

const DEFAULT_DEMAND = reactive({
  total: 0,
  address: null,
  dateOfDemand: new Date(),
  payment: null,
  addressId: null,
  userId: null,
  items: [],
});

const RECORD_DEFAULT = {
  id: null,
  cep: "",
  road: "",
  neighborhood: "",
  city: "",
  uf: "",
  complement: "",
  number: "",
};

const address = ref({ ...RECORD_DEFAULT });
const card = reactive({
  cardNumber: "",
  cardHolderName: "",
  expirationDate: "",
  cvv: "",
  brand: "",
  userId: null,
});

const payment = reactive({
  method: "",
  amount: 0,
  cardId: null,
});

const step = ref(1);
const cartItems = ref([]);
const isPaymentValid = ref(false);

onMounted(() => {
  loadCart();
});

const currentTitle = computed(() => {
  return ["", "Itens", "Dados de Entrega", "Dados de Pagamento"][step.value] || "";
});
const showBackButton = computed(() => step.value > 1);
const showNextButton = computed(() => step.value < 3);
const showFinishButton = computed(() => step.value === 3);

const canProceed = computed(() => {
  switch (step.value) {
    case 1:
      return cartItems.value.length > 0;
    case 2:
      return DEFAULT_DEMAND.addressId !== null;
    default:
      return true;
  }
});

const nextButtonText = computed(() => ["", "Dados de Entrega", "Dados de Pagamento"][step.value]);
const backButtonText = computed(() => ["", "", "Itens", "Dados de Entrega"][step.value]);
const user = computed(() => store.getters["auth/user"]);
const userId = computed(() => user.value?.userId);

const loadCart = () => {
  const cartKey = `cart_${userId?.value}`;
  const cookieCart = Cookies.get(cartKey);
  let parsed = [];

  try {
    parsed = decryptCart(cookieCart);
    if (!Array.isArray(parsed)) parsed = [];
  } catch {
    parsed = [];
  }

  cartItems.value = parsed;
  DEFAULT_DEMAND.items = cartItems.value;
  DEFAULT_DEMAND.total = cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0);
};

const removeItem = (dishId) => {
  const name = cartItems.value.find((item) => item.dishId === dishId)?.name;
  cartItems.value = cartItems.value.filter((item) => item.dishId !== dishId);

  const cartKey = `cart_${userId?.value}`;
  Cookies.set(cartKey, encryptCart(cartItems.value), { expires: 7 });

  DEFAULT_DEMAND.items = cartItems.value;
  DEFAULT_DEMAND.total = cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0);

  showMessage({
    success: true,
    message: `Dish ${name} removed from the cart!`,
  });
};

const formatAddress = () => {
  const { road, neighborhood, number, complement, city, uf, cep } = address.value;
  return [road, neighborhood, number, complement, city, uf, cep].filter(Boolean).join(", ");
};

const finishBuy = async () => {
  try {
    DEFAULT_DEMAND.address = formatAddress();
    DEFAULT_DEMAND.userId = userId.value;
    DEFAULT_DEMAND.payment = {
      amount: DEFAULT_DEMAND.total,
      method: payment.method,
      cardId: payment.cardId,
    };
    const response = await store.dispatch("demand/createDemand", DEFAULT_DEMAND);
    showMessage(response);
    reset();
  } catch (error) {
    showMessage(error);
  }
};

const reset = () => {
  Object.assign(DEFAULT_DEMAND, {
    total: 0,
    address: null,
    addressId: null,
    payment: null,
    dateOfDemand: new Date(),
    userId: null,
    items: [],
  });

  Object.assign(card, {
    cardNumber: "",
    cardHolderName: "",
    expirationDate: "",
    cvv: "",
    brand: "",
  });

  Object.assign(payment, {
    method: "",
    amount: 0,
  });

  Object.assign(address.value, RECORD_DEFAULT);
  cartItems.value = [];
  Cookies.set(`cart_${userId?.value}`, encryptCart([]), { expires: 7 });
  step.value = 1;
};

const handleCepSelect = async (data) => {
  if (!data) {
    address.value = { ...RECORD_DEFAULT };
    DEFAULT_DEMAND.addressId = null;
    return;
  }
  address.value = {
    ...address.value,
    cep: data.cep,
    road: data.road,
    neighborhood: data.neighborhood,
    city: data.city,
    uf: data.uf,
  };
  DEFAULT_DEMAND.addressId = data.id || null;
};

const handleFinished = (val) => {
  isPaymentValid.value = val?.value || false;
};
</script>

<template>
  <div class="fill-height">
    <v-card class="full-height-card">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        <v-avatar color="primary" size="24" v-text="step"></v-avatar>
      </v-card-title>

      <v-window v-model="step" class="window-full-height">
        <v-window-item :value="1" class="window-item-full">
          <span class="totalPrice">
            Total: R$ {{ formatMoney(cartItems.reduce((sum, i) => sum + i.price * i.amount, 0)) }}
          </span>
          <Itens :items="cartItems" @remove-item="removeItem" />
        </v-window-item>

        <v-window-item :value="2" class="window-item-full">
          <Address :address="address" @cep-select="handleCepSelect" />
        </v-window-item>

        <v-window-item :value="3" class="window-item-full">
          <Payment
            :userId="userId"
            :card="card"
            :payment="payment"
            :formPayments="FORM_PAYMENT"
            :amount="DEFAULT_DEMAND.total"
            @update:finished="handleFinished"
            @confirm="finishBuy"
            @update:card="(val) => Object.assign(card, val)"
            @update:payment="(val) => Object.assign(payment, val)"
          />
        </v-window-item>
      </v-window>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn v-if="showBackButton" variant="text" @click="step--"> {{ backButtonText }} </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="showNextButton"
          :disabled="!canProceed"
          color="primary"
          variant="flat"
          @click="step++"
        >
          {{ nextButtonText }}
        </v-btn>
        <v-btn
          v-if="showFinishButton"
          :disabled="!isPaymentValid"
          color="secondary"
          variant="flat"
          @click="finishBuy"
        >
          Finalizar Compra
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.fill-height {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.full-height-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;

  background-color: transparent;
  color: var(--color-text);
}

.window-full-height {
  flex: 1;
  min-height: 0;

  overflow-y: auto;
}

.window-item-full {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.totalPrice {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
  margin-bottom: 10px;
}
</style>
