export function handleApiResponse(response, successMessage = "Operação realizada com sucesso.") {
  const data = response?.data || {};
  const message = isValidMessage(data.message) ? data.message : successMessage;
  return {
    message: message,
    status: response?.status || 200,
    success: true,
  };
}

export function handleApiError(error, defaultMessage = "Erro ao processar a solicitação.") {
  const data = error?.response?.data || {};
  const message = isValidMessage(data.message)
    ? data.message
    : isValidMessage(data.error)
    ? data.error
    : defaultMessage;
  return {
    message: message,
    status: error?.response?.status || 500,
    success: false,
  };
}

const isValidMessage = (value) => {
  return typeof value === "string" && value.trim() !== "";
};
