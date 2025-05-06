<script setup>
import { ref, onMounted, watch } from "vue";
import IMask from "imask";

const props = defineProps({
  card: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:card"]);

const localCard = ref({
  cardNumber: "",
  cardHolderName: "",
  expirationDate: "",
  cvv: "",
});

const cardNumberRef = ref(null);
const expirationDateRef = ref(null);
const cvvRef = ref(null);
const formPayment = ref("credito");

onMounted(() => {
  const cardInput = cardNumberRef.value?.$el?.querySelector("input");
  const dateInput = expirationDateRef.value?.$el?.querySelector("input");
  const cvvInput = cvvRef.value?.$el?.querySelector("input");

  if (cardInput) {
    IMask(cardInput, {
      mask: "0000 0000 0000 0000",
    });
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
    IMask(cvvInput, {
      mask: "000[0]",
    });
  }
});

watch(
  localCard,
  (val) => {
    emit("update:card", val);
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <v-container style="max-width: 500px">
    <v-row>
      <v-col cols="12">
        <v-radio-group v-model="formPayment" inline>
          <v-radio label="Crédito" value="credito"></v-radio>
          <v-radio label="Débito" value="debito"></v-radio>
          <v-radio label="Boleto" value="boleto"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>

    <v-form v-if="formPayment === 'credito' || formPayment === 'debito'">
      <v-text-field
        autocapitalize="off"
        ref="cardNumberRef"
        v-model="localCard.cardNumber"
        label="Número do Cartão"
        clearable
        prepend-inner-icon="mdi-credit-card-outline"
        class="custom-text-field"
      />

      <v-text-field
        v-model="localCard.cardHolderName"
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
            label="CVC"
            clearable
            prepend-inner-icon="mdi-lock"
            class="custom-text-field"
          />
        </v-col>
      </v-row>
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
