import api from "@/api";

const state = {
  dishes: [],
  dish: null,
};

const actions = {
  async getDishes({ commit }) {
    try {
      const response = await api.get("/dishes");
      const data = response.data;

      commit("SET_DISHES", data);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async getDish({ commit }, id) {
    try {
      const response = await api.get(`/dishes/${id}`);
      const data = response.data;
      commit("SET_DISH", data);
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async createDish({ dispatch }, dishData) {
    try {
      const imageToSend = dishData.image || null;

      await api.post(
        "/dishes",
        { ...dishData, image: imageToSend },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch("getDishes");
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async updateDish({ dispatch }, dishData) {
    try {
      const imageToSend = dishData.image || null;

      await api.put(
        `/dishes/${dishData.id}`,
        { ...dishData, image: imageToSend },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch("getDishes");
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },

  async deleteDish({ dispatch }, id) {
    try {
      await api.delete(`/dishes/${id}`);
      dispatch("getDishes");
    } catch (error) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
      };
    }
  },
};

const mutations = {
  SET_DISHES(state, dishes) {
    state.dishes = dishes;
  },

  SET_DISH(state, dish) {
    state.dish = dish;
  },
};

const getters = {
  dishes(state) {
    return state.dishes;
  },

  dish(state) {
    return state.dish;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
