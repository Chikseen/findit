<template>
  <div id="app">
    <router-view />
    <Messege />
  </div>
</template>

<script>
import Messege from "./assets/messageComponent.vue";

export default {
  components: {
    Messege,
  },
  created() {
    if (import.meta.env.MODE == "development") {
      console.log("Build from Local");
      this.$store.commit("setApiSocket", "http://localhost:7080");
    } else {
      console.log("Build from ApiSocket");
      this.$store.commit("setApiSocket", "https://api.drunc.net");
    }
  },
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
