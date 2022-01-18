<template>
  <div class="hello">
    <p>HelloWorld</p>
    <p>current ip {{ip}}</p>
    <button @click="tryFetch">Try Fetch</button>
  </div>
</template>

<script>
import api from "../apiService"

export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  methods: {
    async tryFetch() {
      console.log("Try fetch")
      api.getData("test")
    }
  },
  computed: {
    ip() {
      return api.currentIp()
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
