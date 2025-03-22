import api from "@/api";

const state = {
  user: JSON.parse(localStorage.getItem("user")) || null, // Carrega do localStorage, ou usa null como valor padrão
  name: JSON.parse(localStorage.getItem("name")) || null,
  role: JSON.parse(localStorage.getItem("role")) || null,
};

const actions = {
  async login({ commit }, authData) {
    try {
      const response = await api.post("/login", authData);
      const userData = response.data.user;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("name", JSON.stringify(userData?.name));
      localStorage.setItem("role", JSON.stringify(userData?.role));

      commit("UPDATE_USER", userData);
    } catch (error) {
      throw new Error("Login failed");
    }
  },

  async logout({ commit }) {
    try {
      await api.post("/logout", {}, { withCredentials: true });

      localStorage.removeItem("user");
      localStorage.removeItem("name");
      localStorage.removeItem("role");

      commit("CLEAR_USER");
    } catch (error) {
      throw new Error("Logout failed");
    }
  },

  async fetchUser({ commit }) {
    try {
      const response = await api.get("/profile", { withCredentials: true });
      const userData = response.data.user;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("name", JSON.stringify(userData?.name));
      localStorage.setItem("role", JSON.stringify(userData?.role));

      commit("UPDATE_USER", userData);
    } catch (error) {
      throw new Error("Failed to fetch user data");
    }
  },

  async checkTokenValidity() {
    try {
      const response = await api.get("/validate-token", { withCredentials: true });
      return response.data.valid;
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
