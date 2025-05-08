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