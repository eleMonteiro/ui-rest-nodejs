import axios from "axios";
import auth from "./auth";

const state = {
  users: [],
  user: {},
};

const actions = {
  getUsers({ commit }) {
    axios
      .get("/users", { headers: { Authorization: auth.state.token } })
      .then((res) => {
        commit("SET_USERS", res.data);
      })
      .catch((error) => error);
  },

  getUser({ commit }, id) {
    axios
      .get(`/users/${id}`, { headers: { Authorization: auth.state.token } })
      .then((res) => {
        commit("SET_USER", res.data);
      })
      .catch((error) => error);
  },

  getUserByCPF({ commit }, cpf) {
    axios
      .get("/users/cpf", {
        params: { cpf },
        headers: { Authorization: auth.state.token },
      })
      .then((res) => {
        commit("SET_USER", res.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        commit("SET_USER_ERROR", error.response?.data?.message || "Unknown error");
      });
  },

  createUser({ dispatch }, userData) {
    axios
      .post("/users", userData, { headers: { Authorization: auth.state.token } })
      .then(() => dispatch("getUsers"))
      .catch((error) => error);
  },

  updateUser({ dispatch }, userData) {
    axios
      .put(`/users/${userData.id}`, userData, { headers: { Authorization: auth.state.token } })
      .then(() => dispatch("getUsers"))
      .catch((error) => error);
  },

  deleteUser({ dispatch }, id) {
    axios
      .delete(`/users/${id}`, { headers: { Authorization: auth.state.token } })
      .then(() => dispatch("getUsers"))
      .catch((error) => error);
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
  state,
  actions,
  mutations,
  getters,
};
