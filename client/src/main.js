import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//import { store } from './vuex/store'
import { createStore } from "vuex";
import vueStore from "./vuex/store";
import { TroisJSVuePlugin } from "troisjs";
// Create a new store instance.
const store = createStore(vueStore);
const app = createApp(App);

app.use(TroisJSVuePlugin);
app.use(router);
app.use(store);

app.mount("#app");
