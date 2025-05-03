import axios from "axios";
import api from "@/api";
import { handleApiResponse, handleApiError } from "@/utils/apiResponse";

const apiExterna = axios.create({
  baseURL: import.meta.env.VITE_APP_VIA_CEP_API_URL,
  timeout: 5000,
});

const state = {
  address: null,
};

const actions = {
  async getAddressByCep({ commit }, cep) {
    try {
      const response = await apiExterna.get(`${cep}/json/`);
      commit("UPDATE_ADDRESS", response.data);
      return handleApiResponse(response, "Address fetched successfully");
    } catch (error) {
      commit("UPDATE_ADDRESS", null);
      return handleApiError(error, "Error fetching address");
    }
  },

  async getAddressByFilter({ commit }, filter) {
    try {
      const response = await api.post(`/addresses/search/`, {
        filter: { ...filter },
      });

      commit("UPDATE_ADDRESS", response?.data?.data[0]);
      return handleApiResponse(response?.data, "Address fetched successfully");
    } catch (error) {
      commit("UPDATE_ADDRESS", null);
      return handleApiError(error, "Error fetching address");
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
