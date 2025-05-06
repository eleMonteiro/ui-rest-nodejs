import api from "@/api";
import { handleApiError, handleApiResponse } from "@/utils/apiResponse";

const state = {};

const actions = {
  async downloadBoleto(_, payload) {
    try {
      const response = await api.post("/payments/boleto-pdf", payload, {
        responseType: "blob",
      });

      handleApiResponse(response);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "boleto_simulado.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      handleApiError(error);
    }
  },
};

const mutations = {};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
