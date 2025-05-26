import api from "@/api";
import { handleApiResponse, handleApiError } from "@/utils/apiResponse";

const state = {
  users: [],
  pagination: {},
  user: null,
};

const actions = {
  async getUsers(
    { commit },
    { page = 1, pageSize = 10, sort = { field: "id", order: "asc" }, filter = "" }
  ) {
    try {
      const response = await api.get("/users", {
        params: {
          page,
          pageSize,
          sort,
          filter,
        },
      });
      const { data } = response?.data;
      commit("SET_USERS", data?.users);
      commit("SET_PAGINATION", data?.pagination);
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
  SET_USERS: (state, users) => {
    state.users = users;
  },

  SET_USER: (state, user) => {
    state.user = user;
  },

  SET_PAGINATION: (state, pagination) => {
    state.pagination = pagination;
  },
};

const getters = {
  users: (state) => state.users,

  user: (state) => state.user,

  pagination: (state) => state.pagination,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
