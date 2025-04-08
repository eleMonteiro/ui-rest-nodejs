import api from "@/api";
import { handleApiResponse, handleApiError } from "@/utils/apiResponse";

const state = {
  users: [],
  user: null,
};

const actions = {
  async getUsers({ commit }) {
    try {
      const response = await api.get("/users");
      const { data } = response?.data;
      commit("SET_USERS", data);
      return handleApiResponse(response, "Users fetched successfully");
    } catch (error) {
      return handleApiError(error, "Error fetching users");
    }
  },

  async getUser({ commit }, id) {
    try {
      const response = await api.get(`/users/${id}`);
      const { data } = response?.data;
      commit("SET_USER", data);
      return handleApiResponse(response, "User fetched successfully");
    } catch (error) {
      return handleApiError(error, "Error fetching user");
    }
  },

  async getUserByCPF({ commit }, cpf) {
    try {
      const response = await api.get("/users/cpf", {
        params: { cpf },
      });
      const { data } = response?.data;
      commit("SET_USER", data);
      return handleApiResponse(response, "User fetched successfully");
    } catch (error) {
      return handleApiError(error, "Error fetching user");
    }
  },

  async createUser({ dispatch }, userData) {
    try {
      const { addresses, ...user } = userData;
      const response = await api.post("/users", {
        ...user,
        addresses: addresses,
      });
      return handleApiResponse(response, "User created successfully");
    } catch (error) {
      return handleApiError(error, "Error creating user");
    }
  },

  async updateUser({ dispatch }, userData) {
    try {
      const response = await api.put(`/users/${userData.id}`, userData);
      return handleApiResponse(response, "User updated successfully");
    } catch (error) {
      return handleApiError(error, "Error updating user");
    }
  },

  async deleteUser({ dispatch }, id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return handleApiResponse(response, "User deleted successfully");
    } catch (error) {
      return handleApiError(error, "Error deleting user");
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
