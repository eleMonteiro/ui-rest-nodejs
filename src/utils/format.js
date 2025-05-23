export const formatMoney = (value) => {
  if (value === null || value === undefined) {
    return "0,00";
  }

  if (typeof value === "string") {
    value = value.replace(/\./g, "").replace(",", ".");
  }

  const numberValue = parseFloat(value);
  if (isNaN(numberValue)) {
    return "0,00";
  }

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDate = (date) => {
  if (date === null || date === undefined) {
    return "";
  }

  if (typeof date === "string") {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
};

export const formatDateLong = (date) => {
  if (date === null || date === undefined) {
    return "";
  }

  if (typeof date === "string") {
    date = new Date(date);
  }

  if (isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};
