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
      this.$store.commit("setApiSocket", "http://localhost:7080");
    } else {
      this.$store.commit("setApiSocket", "https://api.drunc.net");
    }
  },
};
</script>

<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;
}

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
