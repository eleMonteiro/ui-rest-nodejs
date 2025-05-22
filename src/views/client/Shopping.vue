<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { useStore } from "vuex";
import { FORM_PAYMENT } from "@/constants/formPayment";
import ItensTable from "@/views/client/shopping/ItensTable.vue";
import AddressForm from "@/views/client/shopping/AddressForm.vue";
import Cookies from "js-cookie";
import PaymentForm from "@/views/client/shopping/PaymentForm.vue";

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
const isLoadingCep = ref(false);
const disabledFields = ref(true);
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
const user = computed(() => store.getters["user/user"]);
const userId = computed(() => user.value?.id);

const loadCart = () => {
  const cookieCart = Cookies.get("cart");
  let parsed = [];

  try {
    parsed = JSON.parse(cookieCart);
    if (!Array.isArray(parsed)) parsed = [];
  } catch {
    parsed = [];
  }

  cartItems.value = parsed;
  DEFAULT_DEMAND.items = cartItems.value;
  DEFAULT_DEMAND.total = cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0);
};

const removeItem = (dishId) => {
  cartItems.value = cartItems.value.filter((item) => item.dishId !== dishId);
  Cookies.set("cart", JSON.stringify(cartItems.value), { expires: 7 });

  DEFAULT_DEMAND.items = cartItems.value;
  DEFAULT_DEMAND.total = cartItems.value.reduce((sum, item) => sum + item.totalPrice, 0);
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

const showMessage = (response) => {
  store.dispatch("snackbar/showSnackbar", {
    text:
      response?.message ||
      (response?.success ? "Operação realizada com sucesso!" : "Erro ao realizar operação!"),
    color: response?.success ? "success" : "error",
  });
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
  Cookies.set("cart", JSON.stringify([]), { expires: 7 });
  step.value = 1;
};

const handleCepBlur = async () => {
  isLoadingCep.value = true;
  if (!address.value.cep) {
    Object.assign(address.value, RECORD_DEFAULT);
    DEFAULT_DEMAND.addressId = null;
    isLoadingCep.value = false;
    return;
  }

  try {
    const response = await store.dispatch("cep/getAddressByFilter", {
      cep: address.value.cep,
      userId: userId.value,
    });

    if (response?.success) {
      const data = store.getters["cep/address"];
      address.value.id = data?.id;
      address.value.road = data?.road;
      address.value.neighborhood = data?.neighborhood;
      address.value.city = data?.city;
      address.value.uf = data?.uf;
      address.value.complement = data?.complement;
      address.value.number = data?.number;
      DEFAULT_DEMAND.addressId = data?.id;
    } else {
      showMessage({ success: false, message: "Endereço não cadastrado" });
    }
  } catch {
    showMessage({ success: false, message: "Erro ao buscar endereço pelo CEP e Usuário" });
  } finally {
    isLoadingCep.value = false;
  }
};

const handleFinished = (val) => {
  console.log("handleFinished", val);
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
          <ItensTable :items="cartItems" @remove-item="removeItem" />
        </v-window-item>

        <v-window-item :value="2" class="window-item-full">
          <AddressForm
            :address="address"
            :disabled-fields="disabledFields"
            :is-loading-cep="isLoadingCep"
            @cep-blur="handleCepBlur"
          />
        </v-window-item>

        <v-window-item :value="3" class="window-item-full">
          <PaymentForm
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
</style>
