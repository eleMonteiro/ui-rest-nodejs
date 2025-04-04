import api from "@/api";
import { handleApiError, handleApiResponse } from "@/utils/apiResponse";

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
      return handleApiResponse(response, "Dishes fetched successfully");
    } catch (error) {
      return handleApiError(error, "Failed to fetch dishes");
    }
  },

  async getDish({ commit }, id) {
    try {
      const response = await api.get(`/dishes/${id}`);
      const data = response.data;
      commit("SET_DISH", data);
      return handleApiResponse(response, "Dish fetched successfully");
    } catch (error) {
      return handleApiError(error, "Failed to fetch dish");
    }
  },

  async createDish({ dispatch }, dishData) {
    try {
      const imageToSend = dishData.image || null;

      const response = await api.post(
        "/dishes",
        { ...dishData, image: imageToSend },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return handleApiResponse(response, "Dish created successfully");
    } catch (error) {
      return handleApiError(error, "Failed to create dish");
    }
  },

  async updateDish({ dispatch }, dishData) {
    try {
      const imageToSend = dishData.image || null;

      const response = await api.put(
        `/dishes/${dishData.id}`,
        { ...dishData, image: imageToSend },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return handleApiResponse(response, "Dish updated successfully");
    } catch (error) {
      return handleApiError(error, "Failed to update dish");
    }
  },

  async deleteDish({ dispatch }, id) {
    try {
      const response = await api.delete(`/dishes/${id}`);
      return handleApiResponse(response, "Dish deleted successfully");
    } catch (error) {
      return handleApiError(error, "Failed to delete dish");
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
