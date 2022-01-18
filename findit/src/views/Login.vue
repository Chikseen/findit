<template>
  <div>
    <h1>FindIt</h1>
    <h3>3D store, share and find</h3>
    <div>
      <LabeldText :name="'User Name'" @change="setusername" />
      <LabeldText :name="'Passwort'" @change="setpasswort" />
      <LabeldText
        v-if="registerMode"
        :name="'Repeat Passwort'"
        @change="confirmpasswort"
      />
      <CTA v-if="!registerMode" :text="'Login'" @click="checkUserData" />
      <CTA v-if="registerMode" :text="'Create account'" @click="createUser" />
      <CTA :text="'TESTBTN'" @click="test" />
      <Button
        v-if="!registerMode"
        :text="'Register'"
        @click="registerMode = true"
      />
      <Button
        v-if="registerMode"
        :text="'Try Login'"
        @click="registerMode = false"
      />
    </div>
    <h1>{{ number.number }}</h1>
    <h1>{{ response }}</h1>
  </div>
</template>

<script>
import LabeldText from "../components/functional/LabeledInput.vue";
import CTA from "../components/functional/CTA.vue";
import Button from "../components/functional/Button.vue";

import api from "../apiService";
import io from "socket.io-client";

export default {
  components: {
    LabeldText,
    CTA,
    Button,
  },
  data() {
    return {
      username: "",
      passwort: "",
      registerMode: false,
      number: 0,
      response: {},
    };
  },
  methods: {
    setusername(e) {
      this.username = e;
    },
    setpasswort(e) {
      this.passwort = e;
    },
    checkUserData() {},
    register() {},
    confirmpasswort() {},
    createUser() {
      api.emit("createUser", {
        userName: this.username,
        passwort: this.passwort,
      });
    },
    test() {
      api.emit("newNumber", {
        userName: this.username,
        passwort: this.passwort,
      });
    },
  },
  mounted() {
    this.socket = io("https://localhost:7080");
    this.socket.on("response", (data) => {
      console.log(data);
    });
    this.socket.on("Number", (arg) => {
      this.number = arg;
    });
    this.socket.on("response", (arg) => {
      console.log("hi", arg)
      this.response = arg;
    });
  },
};
</script>