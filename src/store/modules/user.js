import api from "@/api";

const state = {
  users: [],
  user: {},
};

const actions = {
  getUsers({ commit }) {
    api
      .get("/users")
      .then((res) => {
        commit("SET_USERS", res.data);
      })
      .catch((error) => error);
  },

  getUser({ commit }, id) {
    api
      .get(`/users/${id}`)
      .then((res) => {
        commit("SET_USER", res.data);
      })
      .catch((error) => error);
  },

  getUserByCPF({ commit }, cpf) {
    api
      .get("/users/cpf", {
        params: { cpf },
      })
      .then((res) => {
        commit("SET_USER", res.data);
      })
      .catch((error) => {
        return error || "Unknown error";
      });
  },

  createUser({ dispatch }, userData) {
    api
      .post("/users", userData)
      .then(() => dispatch("getUsers"))
      .catch((error) => error);
  },

  updateUser({ dispatch }, userData) {
    get
      .put(`/users/${userData.id}`, userData)
      .then(() => dispatch("getUsers"))
      .catch((error) => error);
  },

  deleteUser({ dispatch }, id) {
    api
      .delete(`/users/${id}`)
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
