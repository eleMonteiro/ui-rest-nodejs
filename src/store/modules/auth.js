import api from "@/api";

const state = {
  user: null,
  name: null,
  role: null,
};

const actions = {
  async login({ commit }, authData) {
    try {
      await api.post("/login", authData);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async logout({ commit }) {
    try {
      await api.post("/logout", {}, { withCredentials: true });
      commit("CLEAR_USER");
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async fetchUser({ commit }) {
    try {
      const response = await api.get("/profile", { withCredentials: true });
      const userData = response.data.user;
      commit("UPDATE_USER", userData);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async register({ commit }, authData) {
    try {
      await api.post("/register", authData);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async checkTokenValidity({ commit }) {
    try {
      const response = await api.get("/validate-token", { withCredentials: true });
      const { user, valid } = response.data;
      commit("UPDATE_USER", user);
      return valid;
    } catch (error) {
      return false;
    }
  },
};

const getters = {
  isAuthenticated(state) {
    return state.user !== null;
  },

  roleUser(state) {
    return state.role || null;
  },

  user(state) {
    return state.user || null;
  },

  nameUser(state) {
    return state.name || null;
  },
};

const mutations = {
  UPDATE_USER: (state, data) => {
    state.user = data;
    state.role = data?.role;
    state.name = data?.name;
  },

  CLEAR_USER: (state) => {
    state.user = null;
    state.role = null;
    state.name = null;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
