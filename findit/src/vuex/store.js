import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        apiSocket: null,
    },
    getters: {
        getApiSocket: state => {
            return state.apiSocket
        },
    },
    mutations: {
        setApiSocket(state, payload) {
            state.apiSocket = payload
        },
    },
})

/**
 * import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    allLocations: [],
    currentSearch: "",
    currentFilter: { location: [], rating: [], amenities: [] },
    filterdHotels: [],
    currentHotel: { status: "noHotel" },
    timeFrame: { startDate: "", endDate: "" }
  },
  getters: {
    getAllLocations: state => {
      return state.allLocations
    },
    getCurrentSearch: state => {
      return state.currentSearch
    },
    getCurrentFilter: state => {
      return state.currentFilter
    },
    getCurrentHotel: state => {
      return state.currentHotel
    },
    gettimeFrame: state => {
      if ((state.timeFrame.startDate == "") || (state.timeFrame.endDate == "")) {
        let today = new Date();

        let startdate =
          today.getFullYear() +
          "-" +
          String(today.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(today.getDate()).padStart(2, "0");

        let enddate =
          today.getFullYear() +
          "-" +
          String(today.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(today.getDate() + 1).padStart(2, "0");

        let payload = { startDate: startdate, endDate: enddate }
        //  state.timeFrame = payload 
        return payload
      } else {
        return state.timeFrame
      }
    },
    getLocationSearch: state => {

      let filterdLocation = []


      state.allLocations.forEach(location => {
        if (location.name.toLowerCase().includes(state.currentSearch.toLowerCase())) {
          filterdLocation.push(location)
        }
      });
      if (filterdLocation.length === 0) {
        filterdLocation = state.allLocations
      }
      return filterdLocation
    }
  },
  mutations: {
    setCurrentSearch(state, payload) {
      state.currentSearch = payload
    },
    setAllLocation(state, payload) {
      state.allLocations = payload
    },
    setcurrentHotel(state, payload) {
      state.currentHotel = payload
    },
    settimeFrame(state, payload) {
      state.timeFrame = payload
    },
    setQuickFilter(state, payload) {
      switch (payload.isFor) {
        case "location":
          state.currentFilter.location = payload.data
          break;
        case "rating":
          state.currentFilter.rating = payload.data
          break;
        case "amenities":
          state.currentFilter.amenities = payload.data
          break;
      }
    }
  },
})
 */