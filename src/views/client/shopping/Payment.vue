<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useStore } from "vuex";
import useSnackbar from "@/composables/useSnackbar";

const { showMessage } = useSnackbar();

const store = useStore();

const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  card: {
    type: Object,
    default: () => ({}),
  },
  payment: {
    type: Object,
    default: () => ({}),
  },
  formPayments: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:card", "update:payment", "update:finished", "confirm"]);

const localCard = reactive({
  cardNumber: "",
  cardHolderName: "",
  expirationDate: "",
  cvv: "",
  id: null,
  cardType: "",
  brand: "",
  userId: null,
});

const localPayment = reactive({
  method: "CREDITO",
  amount: 0,
  cardId: null,
});

const formPayment = ref("CREDITO");
const newCard = ref(false);
const shouldShowCardForm = computed(() => ["CREDITO", "DEBITO"].includes(formPayment.value));
const shouldShowSlip = computed(() => formPayment.value === "BOLETO");
const disableFields = ref(false);
const isPaymentValid = ref(false);
const validForm = computed(() => {
  return (
    !localCard.cardNumber ||
    !localCard.cardHolderName ||
    !localCard.expirationDate ||
    !localCard.cvv ||
    localCard.cardNumber.length < 16
  );
});

watch(
  () => localCard,
  (val) => emit("update:card", val),
  { deep: true, immediate: true }
);

watch(formPayment, (newMethod) => {
  localPayment.method = newMethod;
  newCard.value = false;
  disableFields.value = false;

  Object.assign(localCard, {
    cardNumber: "",
    cardHolderName: "",
    expirationDate: "",
    cvv: "",
    id: null,
    cardType: "",
    brand: "",
    userId: null,
  });

  localPayment.cardId = null;
  isPaymentValid.value = false;

  emit("update:card", localCard);
  emit("update:payment", localPayment);
  if (newMethod === "PIX" || newMethod === "DINHEIRO") {
    isPaymentValid.value = true;
    emit("update:finished", isPaymentValid);
  } else {
    isPaymentValid.value = false;
    emit("update:finished", isPaymentValid);
  }
});

const handleNumberCardBlur = async () => {
  const cardNumber = localCard.cardNumber.replace(/\s/g, "");
  if (!newCard.value) {
    await fetchCard(cardNumber);
  }
  localCard.brand = identifyCardBrand(cardNumber);
};

const identifyCardBrand = (number) => {
  const num = number.replace(/\D/g, "");
  if (num.length < 6) return "Outra";

  const p1 = +num.slice(0, 1);
  const p2 = +num.slice(0, 2);
  const p4 = +num.slice(0, 4);

  if (num.startsWith("4")) return "Visa";
  if ((p2 >= 51 && p2 <= 55) || (p4 >= 2221 && p4 <= 2720)) return "Mastercard";
  if ([4011, 4312, 4389].includes(p4) || [5, 6].includes(p1)) return "Elo";
  if ([34, 37].includes(p2)) return "American Express";
  if ([38, 60].includes(p2)) return "Hipercard";

  return "Outra";
};

const fetchCard = async (cardNumber) => {
  try {
    const response = await store.dispatch("card/getCardsByFilter", { cardNumber });
    if (response?.success) {
      const card = store.getters["card/cards"][0];
      const cardNumber = localCard?.cardNumber?.replace(/\s/g, "");
      Object.assign(localCard, {
        ...card,
        cardNumber: cardNumber,
      });
      localPayment.cardId = card.id;
      disableFields.value = true;
      isPaymentValid.value = true;
    } else {
      localPayment.cardId = null;
      localCard.id = null;
      newCard.value = true;
      isPaymentValid.value = false;
    }

    emit("update:card", localCard);
    emit("update:payment", localPayment);
    emit("update:finished", isPaymentValid);
  } catch (error) {
    showMessage(error);
  }
};

const createCard = async () => {
  try {
    localCard.userId = props.userId;
    const response = await store.dispatch("card/createCard", { ...localCard });
    if (response?.success) {
      const card = store.getters["card/card"];
      Object.assign(localCard, card);
      localPayment.cardId = card.id;
      disableFields.value = true;
      isPaymentValid.value = true;
    } else {
      localPayment.cardId = null;
      localCard.id = null;
      isPaymentValid.value = false;
    }
    showMessage(response);
  } catch (error) {
    showMessage(error);
  }
};

const downloadSlip = () => {
  const hoje = new Date();
  hoje.setMonth(hoje.getMonth() + 1);
  const vencimento = hoje.toISOString().slice(0, 10);

  store.dispatch("payment/downloadSlip", {
    valor: props.amount,
    vencimento: vencimento,
    codigoBarras: Math.random().toString(36).substring(2, 15),
  });

  setTimeout(() => {
    emit("confirm");
  }, 1000);
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-radio-group v-model="formPayment" inline>
          <v-radio
            v-for="payment in props.formPayments"
            :key="payment.value"
            :value="payment.value"
          >
            <template #label>
              {{ payment.label }}
            </template>
          </v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row v-if="shouldShowSlip">
      <v-col cols="12">
        <v-btn @click="downloadSlip" color="text" variant="outlined">Baixar Boleto</v-btn>
      </v-col>
    </v-row>

    <v-form v-if="shouldShowCardForm">
      <v-checkbox
        v-if="!disableFields"
        v-model="newCard"
        label="Novo Cartão"
        color="white"
        hide-details
      />

      <v-text-field
        v-model="localCard.brand"
        label="Bandeira do Cartão"
        readonly
        disabled
        class="custom-text-field"
      >
        <template #prepend>
          <v-icon color="text">mdi-credit-card-outline</v-icon>
        </template>
      </v-text-field>

      <v-text-field
        autocapitalize="off"
        :disabled="disableFields"
        v-model="localCard.cardNumber"
        label="Número do Cartão"
        clearable
        @blur="handleNumberCardBlur"
        v-mask="'#### #### #### ####'"
        class="custom-text-field"
      >
        <template #prepend>
          <v-icon color="text">mdi-credit-card-outline</v-icon>
        </template>
      </v-text-field>

      <v-text-field
        v-model="localCard.cardHolderName"
        :disabled="disableFields"
        label="Nome do Titular"
        clearable
        class="custom-text-field"
      >
        <template #prepend>
          <v-icon color="text">mdi-account</v-icon>
        </template>
      </v-text-field>

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="localCard.expirationDate"
            :disabled="disableFields"
            label="Validade (MM/AA)"
            clearable
            v-mask="'##/##'"
            class="custom-text-field"
          >
            <template #prepend>
              <v-icon color="text">mdi-calendar</v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="localCard.cvv"
            label="CVC"
            clearable
            :rules="[(v) => /^\d{3,4}$/.test(v) || 'CVC deve ter 3 ou 4 dígitos']"
            v-mask="'####'"
            class="custom-text-field"
          >
            <template #prepend>
              <v-icon color="text">mdi-lock</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-btn
        v-if="newCard"
        :disabled="validForm"
        color="secondary"
        variant="flat"
        @click="createCard"
      >
        Salvar Cartão</v-btn
      >
    </v-form>
  </v-container>
</template>

<style scoped>
.custom-text-field {
  color: var(--color-text-input);
}

.custom-text-field:deep(input) {
  background-color: var(--color-background-input);
  color: var(--color-text-input);
  border: none;
  font-size: 1em;
  font-weight: 200;
}

.custom-text-field:deep(.v-messages__message) {
  color: var(--color-text-input);
}

.custom-text-field:deep(.v-input__control) {
  background-color: var(--color-background-input);
}
</style>
