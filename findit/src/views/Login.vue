<template>
  <div class="login_wrapper">
    <div class="login_logo">
      <Logo />
    </div>
    <div class="login_header">
      <h1>FindIt</h1>
      <h3>3D store, share and find</h3>
    </div>
    <div class="login_loginform" v-if="!validLogin">
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
    <div v-else>
      <div class="login_loginform_input">
        <Button :text="'Logout'" @click="logout" />
      </div>
    </div>
  </div>
</template>

<script>
import Button from "../components/functional/Button.vue";
import Logo from "../assets/icons/logo.vue";

import io from "socket.io-client";

export default {
  name: "Login",
  components: {
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
    logout() {
      this.socket.emit("destroySession", {
        SID: localStorage.getItem("sessionID"),
      });
      localStorage.setItem("sessionID", "");
      this.$store.commit("setloginStatus", false);
    },
  },
  computed: {
    validLogin() {
      return this.$store.getters.getloginStatus;
    },
  },
  created() {
    this.socket = io(this.$store.getters.getApiSocket);

    this.socket.on("respSID", (data) => {
      console.log("resplog", data.status);
      if (data.status != "valid") {
        this.$router.push("/login");
        localStorage.setItem("sessionID", "");
      } else {
        console.log("set Login Status true");
        this.$store.commit("setloginStatus", true);
      }
    });

    this.socket.on("response", (data) => {
      this.$store.commit("setMessage", data);
    });
    this.socket.on("userDataValidated", (data) => {
      this.$store.commit("setloginStatus", true);
      localStorage.setItem("sessionID", data.sessionID);
      this.$router.push("home");
    });
  },
  mounted() {
    console.log("login Status", this.$store.getters.getloginStatus);
    const SID = localStorage.getItem("sessionID");
    if (localStorage.getItem("sessionID") != null) {
      if (SID.length != "") {
        console.log("confrom Login", SID);
        this.socket.emit("checkSID", {
          SID: SID,
        });
      }
    }
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

@media only screen and (max-width: 650px) {
  .login_wrapper {
    flex-direction: column;
    justify-content: space-evenly;
    padding: 50px 10px 0 10px;
  }
  .login_loginform {
    justify-content: space-evenly;
  }
}
</style>
