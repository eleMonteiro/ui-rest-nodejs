<script setup>
import { ref, reactive, computed, onMounted, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import IMask from "imask";

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
});

const emit = defineEmits(["update:card", "update:payment", "confirm"]);

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
  method: "",
  amount: 0,
  cardId: null,
});

const cardNumberRef = ref(null);
const expirationDateRef = ref(null);
const cvvRef = ref(null);
const formPayment = ref("CREDITO");
const newCard = ref(false);
const shouldShowCardForm = computed(() => ["CREDITO", "DEBITO"].includes(formPayment.value));
const shouldShowBoleto = computed(() => formPayment.value === "BOLETO");
const disableFields = ref(false);

onMounted(() => {
  const cardInput = cardNumberRef.value?.$el?.querySelector("input");
  const dateInput = expirationDateRef.value?.$el?.querySelector("input");
  const cvvInput = cvvRef.value?.$el?.querySelector("input");

  if (cardInput) {
    IMask(cardInput, { mask: "0000 0000 0000 0000" });
  }

  if (dateInput) {
    IMask(dateInput, {
      mask: "MM{/}YY",
      blocks: {
        MM: { mask: IMask.MaskedRange, from: 1, to: 12 },
        YY: { mask: IMask.MaskedRange, from: 23, to: 99 },
      },
    });
  }

  if (cvvInput) {
    IMask(cvvInput, { mask: "000[0]" });
  }
});

watch(
  () => localCard,
  (val) => emit("update:card", val),
  { deep: true, immediate: true }
);

watchEffect(() => {
  localPayment.method = formPayment.value;
  newCard.value = false;
  disableFields.value = false;
  emit("update:payment", localPayment);
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
      Object.assign(localCard, card);
      localPayment.cardId = card.id;
      disableFields.value = true;
    } else {
      localPayment.cardId = null;
      localCard.id = null;
    }
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
    } else {
      localPayment.cardId = null;
      localCard.id = null;
    }
    showMessage(response);
  } catch (error) {
    showMessage(error);
  }
};

const downloadBoleto = () => {
  const hoje = new Date();
  hoje.setMonth(hoje.getMonth() + 1);
  const vencimento = hoje.toISOString().slice(0, 10);

  store.dispatch("payment/downloadBoleto", {
    valor: props.amount,
    vencimento: vencimento,
    codigoBarras: Math.random().toString(36).substring(2, 15),
  });

  setTimeout(() => {
    emit("confirm");
  }, 1000);
};

const showMessage = (response) => {
  store.dispatch("snackbar/showSnackbar", {
    text:
      response?.message ||
      (response?.success ? "Operação realizada com sucesso!" : "Erro ao realizar operação!"),
    color: response?.success ? "success" : "error",
  });
};
</script>

<template>
  <v-container style="max-width: 500px">
    <v-row>
      <v-col cols="12">
        <v-radio-group v-model="formPayment" inline>
          <v-radio label="Crédito" value="CREDITO" />
          <v-radio label="Débito" value="DEBITO" />
          <v-radio label="Boleto" value="BOLETO" />
          <v-radio label="Pix" value="PIX" />
          <v-radio label="Dinheiro" value="DINHEIRO" />
        </v-radio-group>
      </v-col>
    </v-row>

    <v-row v-if="shouldShowBoleto">
      <v-col cols="12">
        <v-btn @click="downloadBoleto" color="primary" class="ma-2">Baixar Boleto</v-btn>
      </v-col>
    </v-row>

    <v-form v-if="shouldShowCardForm">
      <v-checkbox
        v-model="newCard"
        :disable="disableFields"
        label="Novo Cartão"
        color="primary"
        hide-details
      />

      <v-text-field
        v-model="localCard.brand"
        label="Bandeira do Cartão"
        readonly
        disabled
        prepend-inner-icon="mdi-credit-card-outline"
        class="custom-text-field"
      />

      <v-text-field
        autocapitalize="off"
        ref="cardNumberRef"
        :disabled="disableFields"
        v-model="localCard.cardNumber"
        label="Número do Cartão"
        clearable
        prepend-inner-icon="mdi-credit-card-outline"
        @blur="handleNumberCardBlur"
        class="custom-text-field"
      />

      <v-text-field
        v-model="localCard.cardHolderName"
        :disabled="disableFields"
        label="Nome do Titular"
        clearable
        prepend-inner-icon="mdi-account"
        class="custom-text-field"
      />

      <v-row>
        <v-col cols="6">
          <v-text-field
            ref="expirationDateRef"
            v-model="localCard.expirationDate"
            :disabled="disableFields"
            label="Validade (MM/AA)"
            clearable
            prepend-inner-icon="mdi-calendar"
            class="custom-text-field"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            ref="cvvRef"
            v-model="localCard.cvv"
            :disabled="disableFields"
            label="CVC"
            clearable
            prepend-inner-icon="mdi-lock"
            class="custom-text-field"
          />
        </v-col>
      </v-row>
      <v-btn v-if="newCard" color="success" variant="flat" @click="createCard">
        Salvar Cartão</v-btn
      >
    </v-form>
  </v-container>
</template>

<style scoped>
.custom-text-field {
  color: var(--white);
}

.custom-text-field:deep(input) {
  background-color: var(--color-primary);
  color: var(--white);
  border: none;
  font-size: 1em;
  font-weight: 200;
}

.custom-text-field:deep(.v-messages__message) {
  color: var(--bronze);
}
</style>
