import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_VIA_CEP_API_URL,
  timeout: 5000,
});

const state = {
  address: null,
};

const actions = {
  async getAddressByCep({ commit }, cep) {
    try {
      const response = await api.get(`${cep}/json/`);
      commit("UPDATE_ADDRESS", response.data);
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },
};

const getters = {
  address(state) {
    return state.address || null;
  },
};

const mutations = {
  UPDATE_ADDRESS: (state, addressData) => {
    state.address = addressData;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
