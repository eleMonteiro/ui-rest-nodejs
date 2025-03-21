import axios from "axios";

const state = {
  user: null,
  token: localStorage.getItem("token"),
  nome: localStorage.getItem("nome"),
  role: localStorage.getItem("role"),
  token_update_date: new Date(localStorage.getItem("token_update_date")),
  tokenExpirado: false,
  permissoes: null,
};

const actions = {
  login({ commit, dispatch }, authData) {
    return new Promise((resolve, reject) => {
      axios
        .post("/login", {
          email: authData.email,
          password: authData.password,
        })
        .then((res) => {
          const date = new Date();
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("token_update_date", date);
          localStorage.setItem("nome", res.data.user.name);
          localStorage.setItem("role", res.data.user.role);

          commit("AUTHENTICATE", { token: res.data.token, date });
          commit("UPDATE_USER", { ...res.data.user });
        })
        .catch((error) => error)
        .finally(() => resolve());
    });
  },

  logout() {
    return new Promise((resolve, reject) => {
      axios
        .post("/logout", { headers: { Authorization: auth.state.token } })
        .then(localStorage.clear())
        .catch((error) => error)
        .finally(() => resolve());
    });
  },

  updateToken({ commit }, tokenData) {
    const date = new Date();
    localStorage.setItem("token", tokenData.token);
    localStorage.setItem("token_update_date", date);
    commit("UPDATE_AUTH_DATA", { token: tokenData.token, date });
  },

  removeToken({ commit }) {
    localStorage.removeItem("token");
    localStorage.removeItem("token_update_date");
    commit("CLEAR_AUTH_DATA");
  },
};

const getters = {
  isAuthenticated(state) {
    return state.token !== null;
  },

  token(state) {
    return state.token ? state.token : null;
  },

  isValidDateToken(state) {
    const MINUTOS_VALIDADE_TOKEN = 60;
    const minutos = parseInt((new Date() - state.token_update_date) / 1000 / 60);
    return minutos < MINUTOS_VALIDADE_TOKEN;
  },

  roleUser(state) {
    return state.role ? state.role : null;
  },

  user(state) {
    return state.user ? state.user : null;
  },
};

const mutations = {
  AUTHENTICATE: (state, authUser) => {
    state.token = authUser.token;
    state.token_update_date = authUser.date;
  },
  CLEAR_AUTH_DATA: (state) => {
    state.token = null;
    state.token_update_date = null;
  },
  UPDATE_AUTH_DATA: (state, tokenData) => {
    state.token = tokenData.token;
    state.token_update_date = tokenData.date;
  },
  UPDATE_USER: (state, data) => {
    state.user = data;
    state.role = data?.role;
  },
  CLEAR_USER: (state) => {
    state.user = null;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
