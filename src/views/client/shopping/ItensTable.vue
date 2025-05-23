<script setup>
import { formatMoney } from "@/utils/format";
import { computed } from "vue";

const props = defineProps({
  items: Array,
});

defineEmits(["remove-item"]);

const headers = [
  { title: "ID", key: "dishId", align: "center" },
  { title: "Dish", key: "name", align: "center" },
  { title: "Quantity", key: "amount", align: "center" },
  { title: "Price", key: "price", align: "center" },
  { title: "Total Value", key: "total", align: "center" },
  { title: "", key: "actions", sortable: false, align: "center" },
];

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
        <v-card color="bgCard">
          <v-card-title>
            <v-icon icon="mdi-cart" size="1.5rem" class="mr-2" color="primary"></v-icon>
            {{ item.name }}
          </v-card-title>

          <v-card-text>
            <v-icon icon="mdi-currency-brl" size="1.5rem" class="mr-2" color="primary"></v-icon>
            {{ formatMoney(item.price) }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" icon @click="$emit('remove-item', item.dishId)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
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
</style>
