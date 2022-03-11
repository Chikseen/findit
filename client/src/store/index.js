import { createStore } from "vuex";

/* export default{
  state: {
    apiSocket: null,
    message: {},
    loginStatus: false,
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
  },
} */

export default createStore({
  state: {
    apiSocket: null,
    message: {},
    loginStatus: false,
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
  },
  actions: {},
  modules: {},
});
