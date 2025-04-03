import api from "@/api";
import { handleApiResponse, handleApiError } from "@/utils/apiResponse";

const state = {
  user: null,
  name: null,
  role: null,
  tokenValid: false,
  email: null,
};

const actions = {
  async login({ commit }, authData) {
    try {
      const response = await api.post("/login", authData);
      return handleApiResponse(response, "Login realizado com sucesso.");
    } catch (error) {
      return handleApiError(error, "Erro ao fazer login.");
    }
  },

  async logout({ commit }) {
    try {
      const response = await api.post("/logout", {}, { withCredentials: true });
      commit("CLEAR_USER");
      return handleApiResponse(response, "Logout realizado com sucesso.");
    } catch (error) {
      return handleApiError(error, "Erro ao fazer logout.");
    }
  },

  async fetchUser({ commit }) {
    try {
      const response = await api.get("/profile", { withCredentials: true });
      commit("UPDATE_USER", response.data.user);
      return handleApiResponse(response, "Usuário carregado com sucesso.");
    } catch (error) {
      return handleApiError(error, "Erro ao buscar usuário.");
    }
  },

  async register({ commit }, authData) {
    try {
      const response = await api.post("/register", authData);
      return handleApiResponse(response, "Registro realizado com sucesso.");
    } catch (error) {
      return handleApiError(error, "Erro ao registrar usuário.");
    }
  },

  async checkTokenValidity({ commit }) {
    try {
      const response = await api.get("/validate-token", { withCredentials: true });
      commit("UPDATE_USER", response.data.user);
      return handleApiResponse(response, "Token validado com sucesso.");
    } catch (error) {
      return handleApiError(error, "Token inválido.");
    }
  },

  async resetPassword({ commit }, email) {
    try {
      const response = await api.post("/forgot-password", { email });
      return handleApiResponse(response, "Email de redefinição enviado com sucesso.");
    } catch (error) {
      return handleApiError(error, "Erro ao enviar email de redefinição.");
    }
  },

  async validateResetToken({ commit }, token) {
    try {
      const response = await api.get(`/reset-password?token=${token}`);
      commit("SET_RESET_TOKEN_VALID", { valid: response.data.valid, email: response.data.email });
      return handleApiResponse(response, "Token de redefinição válido.");
    } catch (error) {
      commit("SET_RESET_TOKEN_VALID", { valid: false, email: null });
      return handleApiError(error, "Token de redefinição inválido.");
    }
  },

  async submitNewPassword({ commit }, { token, newPassword }) {
    try {
      const response = await api.post("/reset-password", { token, newPassword });
      return handleApiResponse(response, "Senha redefinida com sucesso.");
    } catch (error) {
      return handleApiError(error, "Erro ao redefinir senha.");
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

  tokenValid(state) {
    return state.tokenValid;
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

  SET_RESET_TOKEN_VALID: (state, { valid, email }) => {
    state.tokenValid = valid;
    state.email = email;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
