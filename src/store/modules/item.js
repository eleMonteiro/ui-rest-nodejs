import api from "@/api";
import demand from "./demand";

const state = {
  items: [],
  item: null,
};

const actions = {
  async getItems({ commit }) {
    try {
      const response = await api.get("/items");
      const data = response.data;

      commit("SET_ITEMS", data);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async getItem({ commit }, id) {
    try {
      const response = await api.get(`/items/${id}`);
      const data = response.data;
      commit("SET_ITEM", data);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async createItem({ dispatch }, itemData) {
    try {
      await api.post("/items", itemData);
      dispatch("getItems");
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async deleteItem({ dispatch }, id) {
    try {
      await api.delete(`/items/${id}`);
      dispatch("getItems");
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async getItemByDemand({ commit }, demandId) {
    try {
      const response = await api.get("/items/demand/", {
        params: { demandId },
      });
      const data = response.data;
      commit("SET_ITEM", data);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
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
