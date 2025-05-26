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
      return handleApiResponse(response, "Address created successfully.");
    } catch (error) {
      return handleApiError(error, "Error creating address.");
    }
  },

  async updateAddress({ commit }, { id, data }) {
    try {
      const response = await api.put(`/addresses/${id}`, data);
      commit("SET_ADDRESS", response?.data?.data);
      return handleApiResponse(response, "Address updated successfully.");
    } catch (error) {
      return handleApiError(error, "Error updating address.");
    }
  },

  async deleteAddress({ commit }, id) {
    try {
      const response = await api.delete(`/addresses/${id}`);
      return handleApiResponse(response, "Address deleted successfully.");
    } catch (error) {
      return handleApiError(error, "Error deleting address.");
    }
  },

  async getAddressesByFilter({ commit }, filter) {
    try {
      const response = await api.post(`/addresses/search/`, {
        filter: { ...filter },
      });

      commit("SET_ADDRESSES", response?.data?.data || []);
      return handleApiResponse(response?.data, "Addresses fetched successfully.");
    } catch (error) {
      commit("SET_ADDRESSES", []);
      return handleApiError(error, "Error fetching addresses.");
    }
  },

  async getAddressById({ commit }, id) {
    try {
      const response = await api.get(`/addresses/${id}`);
      commit("SET_ADDRESS", response?.data?.data);
      return handleApiResponse(response, "Address loaded successfully.");
    } catch (error) {
      commit("SET_ADDRESS", {});
      return handleApiError(error, "Error loading address.");
    }
  },
};

const mutations = {
  SET_ADDRESS: (state, address) => {
    state.addresses.push(address);
  },

  SET_ADDRESSES: (state, addresses) => {
    state.addresses = addresses;
  },
};

const getters = {
  addresses: (state) => state.addresses,

  address: (state) => state.address,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
