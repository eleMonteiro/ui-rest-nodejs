export const maskCpf = (event) => {
  let value = event.target.value.replace(/\D/g, "").slice(0, 11);

  const formattedValue = value
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

  event.target.value = formattedValue;
  return formattedValue;
};
