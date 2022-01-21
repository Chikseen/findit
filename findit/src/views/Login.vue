<template>
  <div class="login_wrapper">
    <div class="login_logo">
      <Logo />
    </div>
    <div class="login_header">
      <h1>FindIt</h1>
      <h3>3D store, share and find</h3>
    </div>
    <div class="login_loginform">
      <div class="login_loginform-selection">
        <form action="#">
          <div class="login_loginform_wrapper">
            <div class="login_loginform_input">
              <label for="loginUserName">Username</label>
              <input
                id="loginUserName"
                type="email"
                placeholder="E-Mail"
                autocomplete="username"
                v-model="username"
              />
            </div>
            <div class="login_loginform_input">
              <label for="loginUserPasswort">Passwort</label>
              <input
                type="password"
                id="loginUserPasswort"
                placeholder="Passwort"
                autocomplete="current-password"
                v-model="passwort"
              />
            </div>
            <div class="login_loginform_input" v-if="registerMode">
              <label for="loginUserPasswort">Repeat passwort</label>
              <input
                type="password"
                placeholder="Repeat passwort"
                v-model="repeatPasswort"
              />
            </div>
          </div>
          <div></div>
        </form>
      </div>
      <div class="login_loginform-selection">
        <div class="login_loginform_input" v-if="!registerMode">
          <Button :text="'Login'" @click="validateLogin" />
        </div>
        <div class="login_loginform_input" v-if="registerMode">
          <Button :text="'Register'" @click="createAccount" />
        </div>
        <div class="login_loginform_input" v-if="!registerMode">
          <Button :text="'Create Account'" @click="registerMode = true" />
        </div>
        <div class="login_loginform_input" v-if="registerMode">
          <Button :text="'I have a Account'" @click="registerMode = false" />
        </div>
      </div>
    </div>

    <!--     <div>
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
    </div> -->
  </div>
</template>

<script>
//import LabeldText from "../components/functional/LabeledInput.vue";
//import CTA from "../components/functional/CTA.vue";
import Button from "../components/functional/Button.vue";
import Logo from "../assets/icons/logo.vue";

import io from "socket.io-client";

export default {
  name: "Login",
  components: {
    //LabeldText,
    //CTA,
    Button,
    Logo,
  },
  data() {
    return {
      username: "",
      passwort: "",
      repeatPasswort: "",
      registerMode: false,
      number: 0, // Debug
    };
  },
  methods: {
    validateLogin() {
      this.socket.emit("validateLogin", {
        userName: this.username,
        passwort: this.passwort,
      });
    },
    createAccount() {
      this.socket.emit("createAccount", {
        userName: this.username,
        passwort: this.passwort,
        repeatPasswort: this.repeatPasswort,
      });
    },
    checkUserData() {
      this.socket.emit("checkUser", {
        userName: this.username,
        passwort: this.passwort,
      });
    },
    register() {},
    confirmpasswort() {},
    createUser() {
      this.socket.emit("createUser", {
        userName: this.username,
        passwort: this.passwort,
      });
    },
  },
  mounted() {
    this.socket = io(this.$store.getters.getApiSocket);

    this.socket.on("response", (data) => {
      this.$store.commit("setMessage", data);
    });
    this.socket.on("userDataValidated", (data) => {
      console.log("data", data)
      this.$router.push('home')
    });
  },
};
</script>

<style>
.login_wrapper {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  height: 150px;
  padding: 50px 10px 0 10px;
}
.login_logo {
  width: 100px;
  height: 150px;
}
.login_loginform {
  display: flex;
  flex-direction: row;
}
.login_loginform_input {
  display: flex;
  flex-direction: column;
  padding: 5px;
  min-width: 150px;
}

.login_loginform-selection {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>