import api from "@/api";

const state = {
  users: [],
  user: null,
};

const actions = {
  async getUsers({ commit }) {
    try {
      const response = await api.get("/users");
      const data = response.data;

      commit("SET_USERS", data);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async getUser({ commit }, id) {
    try {
      const response = await api.get(`/users/${id}`);
      const data = response.data;
      commit("SET_USER", data);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async getUserByCPF({ commit }, cpf) {
    try {
      const response = await api.get("/users/cpf", {
        params: { cpf },
      });
      const data = response.data;

      commit("SET_USER", data);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async createUser({ dispatch }, userData) {
    try {
      const { roles, addresses, ...user } = userData;
      await api.post("/users", {
        ...user,
        roles: [roles],
        addresses: [addresses],
      });
      dispatch("getUsers");
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async updateUser({ dispatch }, userData) {
    try {
      const { roles, addresses, ...user } = userData;

      await get.put(`/users/${userData.id}`, {
        ...user,
        roles: [roles],
        addresses: [addresses],
      });
      dispatch("getUsers");
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async deleteUser({ dispatch }, id) {
    try {
      await api.delete(`/users/${id}`);
      dispatch("getUsers");
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },
};

const mutations = {
  SET_USERS(state, users) {
    state.users = users;
  },

  SET_USER(state, user) {
    state.user = user;
  },
};

const getters = {
  users(state) {
    return state.users;
  },

  user(state) {
    return state.user;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
