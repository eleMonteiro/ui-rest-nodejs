const state = {
  show: false,
  text: "",
  color: "success",
};

const actions = {
  showSnackbar({ commit }, payload) {
    commit("SHOW_MESSAGE", payload);
    setTimeout(() => {
      commit("HIDE_MESSAGE");
    }, 3000);
  },
};

const mutations = {
  SHOW_MESSAGE: (state, { text, color = "success" }) => {
    state.show = true;
    state.text = text ? text : "No message provided";
    state.color = color;
  },

  HIDE_MESSAGE: (state) => {
    state.show = false;
  },
};

const getters = {
  isSnackbarVisible: (state) => state.show,

  snackbarText: (state) => state.text,

  snackbarColor: (state) => state.color,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
