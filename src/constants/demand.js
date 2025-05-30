export const DEMAND_STATUS = [
  {
    value: "PENDENTE",
    label: "Pendente",
    icon: "mdi-clock-outline",
    color: "#FFD580",
  },
  {
    value: "RECEBIDO",
    label: "Recebido",
    icon: "mdi-silverware-fork-knife",
    color: "#B0E0E6",
  },
  {
    value: "EM_PREPARACAO",
    label: "Em Preparação",
    icon: "mdi-pot-mix",
    color: "#FFB6C1",
  },
  {
    value: "PRONTO_PARA_RETIRADA",
    label: "Pronto para retirada",
    icon: "mdi-storefront",
    color: "#E6E6FA",
  },
  {
    value: "PRONTO_PARA_ENTREGA",
    label: "Pronto para entrega",
    icon: "mdi-truck-check",
    color: "#C1F0F6",
  },
  {
    value: "ENTREGUE",
    label: "Entregue",
    icon: "mdi-package-check",
    color: "#C3FDB8",
  },
  {
    value: "CANCELADO",
    label: "Cancelado",
    icon: "mdi-close-circle",
    color: "#F4C2C2",
  },
];

export const DEMAND_DELIVERY_METHOD = [
  { value: "RETIRADA", label: "Retirada", icon: "mdi-store" },
  { value: "ENTREGA", label: "Entrega", icon: "mdi-truck-delivery" },
];
