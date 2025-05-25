<script setup>
import { ref, onMounted, computed } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  address: {
    type: Object,
    required: true,
    default: () => ({
      cep: "",
      road: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      uf: "",
    }),
  },
});

const store = useStore();

const user = computed(() => store.getters["user/user"]);
const userId = computed(() => user.value?.id);
const addresses = ref([]);
const isLoadingCep = ref(props.isLoadingCep);
const selectedAddressId = ref(null);

onMounted(() => {
  fetchAddresses();
});

const emit = defineEmits(["cep-select"]);

const isSelected = (address) => {
  return selectedAddressId.value === address.id;
};

const iconColor = (address) => {
  return isSelected(address) ? "success" : "primary";
};

const iconTooltip = (address) => {
  return isSelected(address) ? "Selecionado" : "Selecionar";
};

const iconName = (address) => {
  return isSelected(address) ? "mdi-check-circle" : "mdi-checkbox-blank-circle-outline";
};

const selectAddress = (address) => {
  if (isSelected(address)) {
    selectedAddressId.value = null;
    emit("cep-select", null);
    return;
  }
  selectedAddressId.value = address.id;
  emit("cep-select", address);
};

const fetchAddresses = async () => {
  try {
    const response = await store.dispatch("cep/getAddressesByFilter", {
      userId: userId.value,
    });

    if (response?.success) {
      const data = store.getters["cep/addresses"];
      addresses.value = data || [];
    } else {
      showMessage({ success: false, message: "Endereços não cadastrado" });
    }
  } catch {
    showMessage({ success: false, message: "Erro ao buscar endereço pelo CEP e Usuário" });
  } finally {
    isLoadingCep.value = false;
  }
};

const groupedItems = computed(() => {
  const rows = [];
  if (!addresses.value) return rows;

  for (let i = 0; i < addresses.value.length; i += 3) {
    rows.push(addresses.value.slice(i, i + 3));
  }
  return rows;
});

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
  <v-row>
    <template v-for="(row, rowIndex) in groupedItems" :key="rowIndex">
      <v-col v-for="(item, index) in row" :key="index" cols="12" sm="2" md="2">
        <v-card color="bgCard" :key="item.id">
          <v-card-title class="title-card">
            <v-icon icon="mdi-map-marker" size="1.5rem" class="mr-2" color="primary"></v-icon>
            {{ item.road }}
          </v-card-title>

          <v-card-text class="subtitle-card">
            {{ item.number }} - {{ item.neighborhood }}, {{ item.city }} - {{ item.uf }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip :text="iconTooltip(item)" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon @click="selectAddress(item)">
                  <v-icon :color="iconColor(item)">
                    {{ iconName(item) }}
                  </v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </template>
  </v-row>
</template>

<style scoped>
.no-horizontal-scroll {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}

.title-card {
  font-size: 1.1rem;
  font-weight: bold;
  text-wrap: break-word;
  white-space: normal;
}

.subtitle-card {
  font-size: 1rem;
  font-weight: normal;
  text-wrap: break-word;
  white-space: normal;
}
</style>
