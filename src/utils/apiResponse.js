export function handleApiResponse(response, successMessage = "Operação realizada com sucesso.") {
  return {
    message: response?.data?.message || successMessage,
    status: response?.status || 200,
    success: true,
    data: response?.data || null,
  };
}

export function handleApiError(error, defaultMessage = "Erro ao processar a solicitação.") {
  return {
    message: error?.response?.data?.message || error?.response?.data?.error || defaultMessage,
    status: error?.response?.status || 500,
    success: false,
    data: error?.response?.data || null,
  };
}
