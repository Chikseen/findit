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
    if (process.env.NODE_ENV == "development") {
      console.log("Build from Local");
      this.$store.commit("setApiSocket", "http://localhost:7080");
    } else {
      console.log("Build from ApiSocket");
      this.$store.commit("setApiSocket", "https://api.drunc.net");
    }
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
