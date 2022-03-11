<template>
  <div class="app">
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
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100px;
}

.app {
  height: 100px;
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
.footer {
  position: relative;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  background-color: #2b2c2e;
  color: aliceblue;
  justify-content: center;
}

.footer > p {
  cursor: pointer;
}
</style>
