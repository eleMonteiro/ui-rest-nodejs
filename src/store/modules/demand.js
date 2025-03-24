import api from "@/api";

const state = {
  demands: [],
  demand: null,
};

const actions = {
  async getDemands({ commit }) {
    try {
      const response = await api.get("/demands");
      const data = response.data;

      commit("SET_DEMANDS", data);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async getDemand({ commit }, id) {
    try {
      const response = await api.get(`/demands/${id}`);
      const data = response.data;
      commit("SET_DEMAND", data);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async createDemand({ dispatch }, demandData) {
    try {
      await api.post("/demands", demandData);
      dispatch("getDemands");
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async deleteDemand({ dispatch }, id) {
    try {
      await api.delete(`/demands/${id}`);
      dispatch("getDemands");
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async getDemandByUser({ commit }, userId) {
    try {
      const response = await api.get("/demands/user/", {
        params: { userId },
      });
      const data = response.data;
      commit("SET_DEMAND", data);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
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
