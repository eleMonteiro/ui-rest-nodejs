import api from "@/api";
import { handleApiResponse, handleApiError } from "@/utils/apiResponse";

const state = {
  address: {},
  addresses: [],
};

const actions = {
  async createAddress({ commit }, data) {
    try {
      const response = await api.post("/addresses/", data);
      commit("SET_ADDRESS", response?.data?.data);
      return handleApiResponse(response, "Endereço criado com sucesso.");
    } catch (error) {
      return handleApiError(error, "Erro ao criar endereço.");
    }
  },

  async updateAddress({ commit }, { id, data }) {
    try {
      const response = await api.put(`/addresses/${id}`, data);
      commit("SET_ADDRESS", response?.data?.data);
      return handleApiResponse(response, "Endereço atualizado com sucesso.");
    } catch (error) {
      return handleApiError(error, "Erro ao atualizar endereço.");
    }
  },

  async deleteAddress({ commit }, id) {
    try {
      const response = await api.delete(`/addresses/${id}`);
      return handleApiResponse(response, "Endereço excluído com sucesso.");
    } catch (error) {
      return handleApiError(error, "Erro ao excluir endereço.");
    }
  },

  async getAddressesByFilter({ commit }, filter) {
    try {
      const response = await api.post(`/addresses/search/`, {
        filter: { ...filter },
      });

      commit("SET_ADDRESSES", response?.data?.data || []);
      return handleApiResponse(response?.data, "Addresses fetched successfully");
    } catch (error) {
      commit("SET_ADDRESSES", []);
      return handleApiError(error, "Error fetching addresses");
    }
  },

  async getAddressById({ commit }, id) {
    try {
      const response = await api.get(`/addresses/${id}`);
      commit("SET_ADDRESS", response?.data?.data);
      return handleApiResponse(response, "Endereço carregado com sucesso.");
    } catch (error) {
      commit("SET_ADDRESS", {});
      return handleApiError(error, "Erro ao carregar endereço.");
    }
  },
};

const mutations = {
  SET_ADDRESS(state, address) {
    state.addresses.push(address);
  },

  SET_ADDRESSES(state, addresses) {
    state.addresses = addresses;
  },
};

const getters = {
  addresses: (state) => {
    return state.addresses;
  },

  address: (state) => {
    return state.address;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
