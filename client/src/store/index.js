import { createStore } from "vuex";

export default createStore({
  state: {
    apiSocket: null,
    message: {},
    loginStatus: false,
    mainSelected: 0,
    scaleSelected: 0,
  },
  getters: {
    getApiSocket: (state) => {
      return state.apiSocket;
    },
    getloginStatus: (state) => {
      return state.loginStatus;
    },
  },
  mutations: {
    setApiSocket(state, payload) {
      state.apiSocket = payload;
    },
    setMessage(state, payload) {
      state.message = payload;
    },
    setloginStatus(state, payload) {
      state.loginStatus = payload;
    },
    setMainSelected(state, payload) {
      state.mainSelected = payload;
    },
    setScaleSelected(state, payload) {
      state.scaleSelected = payload;
    },
  },
  actions: {},
  modules: {},
});
