<script setup>
import { formatMoney } from "@/utils/format";
import { computed } from "vue";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["remove-item"]);

const groupedItems = computed(() => {
  const rows = [];
  if (!props.items) return rows;

  for (let i = 0; i < props.items.length; i += 3) {
    rows.push(props.items.slice(i, i + 3));
  }
  return rows;
});
</script>

<template>
  <v-row>
    <template v-for="(row, rowIndex) in groupedItems" :key="rowIndex">
      <v-col v-for="(item, index) in row" :key="index" cols="12" sm="2" md="2">
        <v-card color="bgCard" :key="item.dishId">
          <v-card-title class="title-card">
            <v-icon icon="mdi-cart" size="1.5rem" class="mr-2" color="primary"></v-icon>
            {{ item.name }}
          </v-card-title>

          <v-card-text class="subtitle-card">
            {{ item.amount }} x R$ {{ formatMoney(item.price) }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip text="Remover" location="top">
              <template v-slot:activator="{ props }">
                <v-btn v-bind="props" icon @click="$emit('remove-item', item.dishId)">
                  <v-icon>mdi-delete</v-icon>
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
