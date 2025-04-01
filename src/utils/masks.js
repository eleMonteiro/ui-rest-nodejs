/**
 * Aplica máscara de CPF a um evento de input
 * @param {Event} event - Evento de input do elemento
 * @returns {string} - Valor formatado
 */
export const applyCpfMask = (event) => {
  let value = event.target.value;
  const unformatted = value.replace(/\D/g, "");
  const limited = unformatted.slice(0, 11);

  const formattedValue = limited
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

  event.target.value = formattedValue;
  return formattedValue;
};

/**
 * Valida se um CPF tem 11 dígitos
 * @param {string} cpf - CPF formatado ou não
 * @returns {string} - CPF válido ou string vazia se inválido
 */
export const validateCpf = (cpf) => {
  const digits = cpf.replace(/\D/g, "");
  return digits.length === 11 ? cpf : "";
};

/**
 * Formata um CPF (pode ser usado para valores iniciais)
 * @param {string} cpf - CPF sem formatação
 * @returns {string} - CPF formatado
 */
export const formatCpf = (cpf) => {
  if (!cpf) return "";
  const digits = cpf.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
};

/**
 * Remove a formatação do CPF
 * @param {string} cpf - CPF formatado
 * @returns {string} - Apenas os dígitos
 */
export const unformatCpf = (cpf) => {
  return cpf.replace(/\D/g, "");
};

/**
 * Formata uma data no padrão dd/MM/yyyy
 * @param {string|Date} date - Data a ser formatada (string ou objeto Date)
 * @returns {string} - Data formatada ou string vazia se inválida
 */
export const formatDate = (date) => {
  if (!date) return "";

  // Se for string, tenta converter para Date
  let dateObj = typeof date === "string" ? new Date(date) : date;

  // Verifica se é uma data válida
  if (isNaN(dateObj.getTime())) return "";

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formata um CEP no padrão 00.000-000
 * @param {string} cep - CEP a ser formatado
 * @returns {string} - CEP formatado
 */
export const formatCep = (cep) => {
  if (!cep) return "";
  const digits = cep.replace(/\D/g, "").slice(0, 8);

  if (digits.length <= 5) {
    return digits;
  }

  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}-${digits.slice(5)}`;
};

/**
 * Aplica máscara de CEP a um evento de input
 * @param {Event} event - Evento de input do elemento
 * @returns {string} - Valor formatado
 */
export const applyCepMask = (event) => {
  let value = event.target.value;
  const unformatted = value.replace(/\D/g, "");
  const limited = unformatted.slice(0, 8);

  let formattedValue = limited;
  if (limited.length > 5) {
    formattedValue = `${limited.slice(0, 2)}.${limited.slice(2, 5)}-${limited.slice(5)}`;
  } else if (limited.length > 2) {
    formattedValue = `${limited.slice(0, 2)}.${limited.slice(2)}`;
  }

  event.target.value = formattedValue;
  return formattedValue;
};

/**
 * Aplica máscara de data a um evento de input
 * @param {Event} event - Evento de input do elemento
 * @returns {string} - Valor formatado
 */
export const applyDateMask = (event) => {
  let value = event.target.value;
  const unformatted = value.replace(/\D/g, "");
  const limited = unformatted.slice(0, 8);

  let formattedValue = limited;
  if (limited.length > 4) {
    formattedValue = `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
  } else if (limited.length > 2) {
    formattedValue = `${limited.slice(0, 2)}/${limited.slice(2)}`;
  }

  event.target.value = formattedValue;
  return formattedValue;
};

/**
 * Valida se uma data está no formato dd/MM/yyyy
 * @param {string} date - Data formatada
 * @returns {boolean} - True se a data for válida
 */
export const validateDate = (date) => {
  if (!date) return false;
  const match = date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  // Verificação simples da data
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  return true;
};

/**
 * Remove a formatação do CEP
 * @param {string} cep - CEP formatado
 * @returns {string} - Apenas os dígitos
 */
export const unformatCep = (cep) => {
  return cep.replace(/\D/g, "");
};
