<template>
  <div class="hello">
    <p>Hello World</p>
    <button @click="numberGen">Get And Show Random Number to everyone</button>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "HelloWorld",
  methods: {
    async numberGen() {
      this.socket.emit("newNumber");
    },
  },
  created() {
    this.socket = io("https://drunc.net:7080");
  },
  mounted() {
    this.socket.on("hello", (arg) => {
      console.log(arg); // world
    });
    this.socket.on("Number", (arg) => {
      console.log(arg); // world
    });
  },
};
</script>

<style >
</style>
