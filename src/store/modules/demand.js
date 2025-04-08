import api from "@/api";
import { handleApiResponse, handleApiError } from "@/utils/apiResponse";

const state = {
  demands: [],
  demand: null,
};

const actions = {
  async getDemands({ commit }) {
    try {
      const response = await api.get("/demands");
      const { data } = response?.data;
      commit("SET_DEMANDS", data);
      return handleApiResponse(response, "Demands fetched successfully");
    } catch (error) {
      commit("SET_DEMANDS", []);
      return handleApiError(error, "Error fetching demands");
    }
  },

  async getDemand({ commit }, id) {
    try {
      const response = await api.get(`/demands/${id}`);
      const { data } = response?.data;
      commit("SET_DEMAND", data);
      return handleApiResponse(response, "Demand fetched successfully");
    } catch (error) {
      commit("SET_DEMAND", null);
      return handleApiError(error, "Error fetching demand");
    }
  },

  async createDemand({ dispatch }, demandData) {
    try {
      const response = await api.post("/demands", demandData);
      return handleApiResponse(response, "Demand created successfully");
    } catch (error) {
      return handleApiError(error, "Error creating demand");
    }
  },

  async deleteDemand({ dispatch }, id) {
    try {
      const response = await api.delete(`/demands/${id}`);
      return handleApiResponse(response, "Demand deleted successfully");
    } catch (error) {
      return handleApiError(error, "Error deleting demand");
    }
  },

  async getDemandByUser({ commit }, userId) {
    try {
      const response = await api.get("/demands/user/", {
        params: { userId },
      });
      const { data } = response?.data;
      commit("SET_DEMAND", data);
      return handleApiResponse(response, "Demand fetched successfully by user");
    } catch (error) {
      return handleApiError(error, "Error fetching demand by user");
    }
  },
};

const mutations = {
  SET_DEMANDS(state, demands) {
    state.demands = demands;
  },

  SET_DEMAND(state, demand) {
    state.demand = demand;
  },
};

const getters = {
  demands(state) {
    return state.demands;
  },

  demand(state) {
    return state.demand;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
