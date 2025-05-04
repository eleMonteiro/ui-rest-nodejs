import api from "@/api";
import { handleApiResponse, handleApiError } from "@/utils/apiResponse";

const state = {
  items: [],
  item: null,
};

const actions = {
  async getItems({ commit }) {
    try {
      const response = await api.get("/items");
      const { data } = response?.data;
      commit("SET_ITEMS", data);
      return handleApiResponse(response, "Items fetched successfully");
    } catch (error) {
      return handleApiError(error, "Failed to fetch items");
    }
  },

  async getItem({ commit }, id) {
    try {
      const response = await api.get(`/items/${id}`);
      const { data } = response?.data;
      commit("SET_ITEM", data);
      return handleApiResponse(response, "Item fetched successfully");
    } catch (error) {
      return handleApiError(error, "Failed to fetch item");
    }
  },

  async createItem({ dispatch }, itemData) {
    try {
      const response = await api.post("/items", itemData);
      return handleApiResponse(response, "Item created successfully");
    } catch (error) {
      return handleApiError(error, "Failed to create item");
    }
  },

  async deleteItem({ dispatch }, id) {
    try {
      const response = await api.delete(`/items/${id}`);
      return handleApiResponse(response, "Item deleted successfully");
    } catch (error) {
      return handleApiError(error, "Failed to delete item");
    }
  },

  async getItemByDemand({ commit }, demandId) {
    try {
      const response = await api.get("/items/demand", {
        params: { demandId },
      });
      const { data } = response?.data;
      commit("SET_ITEMS", data);
      return handleApiResponse(response, "Items fetched by demand successfully");
    } catch (error) {
      return handleApiError(error, "Failed to fetch items by demand");
    }
  },
};

const mutations = {
  SET_ITEMS(state, items) {
    state.items = items;
  },

  SET_ITEM(state, item) {
    state.item = item;
  },
};

const getters = {
  item(state) {
    return state.item;
  },

  items(state) {
    return state.items;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
