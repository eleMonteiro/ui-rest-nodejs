import api from "@/api";
import { handleApiError, handleApiResponse } from "@/utils/apiResponse";

const state = {
  card: null,
  cards: [],
};

const actions = {
  async getCardsByFilter({ commit }, filter) {
    try {
      const response = await api.post("/cards/search", {
        filter: { ...filter },
      });
      const { data } = response?.data;
      commit("SET_CARDS", data);
      return handleApiResponse(response, "Card fetched successfully");
    } catch (error) {
      return handleApiError(error, "Failed to fetch card");
    }
  },

  async getCard({ commit }, id) {
    try {
      const response = await api.get(`/cards/${id}`);
      const { data } = response?.data;
      commit("SET_CARD", data);
      return handleApiResponse(response, "Card fetched successfully");
    } catch (error) {
      return handleApiError(error, "Failed to fetch card");
    }
  },

  async createCard({ commit }, card) {
    try {
      const response = await api.post("/cards", card);
      const { data } = response?.data;
      commit("SET_CARD", data);
      return handleApiResponse(response, "Card created successfully");
    } catch (error) {
      return handleApiError(error, "Failed to create card");
    }
  },

  async updateCard({ commit }, card) {
    try {
      const response = await api.put(`/cards/${card.id}`, card);
      const { data } = response?.data;
      commit("SET_CARD", data);
      return handleApiResponse(response, "Card updated successfully");
    } catch (error) {
      return handleApiError(error, "Failed to update card");
    }
  },

  async deleteCard({ commit }, id) {
    try {
      const response = await api.delete(`/cards/${id}`);
      commit("SET_CARD", null);
      return handleApiResponse(response, "Card deleted successfully");
    } catch (error) {
      return handleApiError(error, "Failed to delete card");
    }
  },
};

const mutations = {
  SET_CARD: (state, card) => {
    state.card = card;
  },

  SET_CARDS: (state, cards) => {
    state.cards = cards;
  },
};

const getters = {
  card: (state) => state.card,

  cards: (state) => state.cards,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
