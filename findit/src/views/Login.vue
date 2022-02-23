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
          <Button :text="'Register'" @click="createUser" />
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
        <Button :text="'Home'" @click="tryLogin" />
      </div>
    </div>
  </div>
</template>

<script>
import Button from "../assets/Button.vue";
import Logo from "../assets/icons/logo.vue";

import io from "socket.io-client";
import api from "../apiService";

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
    async createUser() {
      const data = await api.fetchData(
        "user/createAccount",
        `data=${JSON.stringify({
          userName: this.username,
          passwort: this.passwort,
          repeatPasswort: this.repeatPasswort,
        })}`
      );
      console.log("createUser", await data);
      this.$store.commit("setMessage", data);
    },

    async validateLogin() {
      console.log("check");
      const data = await api.fetchData(
        "user/validateLogin",
        `data=${JSON.stringify({
          userName: this.username,
          passwort: this.passwort,
        })}`
      );
      console.log("validateLogin", await data);
      this.$store.commit("setMessage", data);
      if (data.succes) {
        this.$store.commit("setloginStatus", true);
        localStorage.setItem("sessionID", data.SID);
        localStorage.setItem("usr", this.username);
        //this.$router.push("home");
      }
    },
    /*     tryLogin() {
      this.socket.emit("validateSession", {
        sessionID: localStorage.getItem("sessionID"),
      });
    },
    checkUserData() {
      this.socket.emit("checkUser", {
        userName: this.username,
        passwort: this.passwort,
      });
    },*/
    logout() {
      this.socket.emit("destroySession", {
        SID: localStorage.getItem("sessionID"),
      });
      localStorage.setItem("sessionID", "");
      localStorage.setItem("usr", "");
      this.$store.commit("setloginStatus", false);
    },

    async validateSession(SID) {
      console.log("this session", SID);
      const data = await api.fetchData(
        "session/validate",
        `data=${JSON.stringify({
          SID: SID,
        })}`
      );
      console.log("FIRST", data);
      if (data.status == "valid") {
        this.$store.commit("setloginStatus", true);
        localStorage.setItem("sessionID", SID);
        //this.$router.push("home");
      } else {
        localStorage.clear();
      }
    },
  },
  computed: {
    validLogin() {
      return this.$store.getters.getloginStatus;
    },
  },
  created() {
    this.socket = io(this.$store.getters.getApiSocket);

    /*  this.socket.on("respSID", (data) => {
      console.log("resplog", data.status);
      if (data.status != "valid") {
        this.$router.push("/login");
        localStorage.setItem("sessionID", "");
      } else {
        console.log("set Login Status true");
        this.$store.commit("setloginStatus", true);
      }
    }); */
  },
  mounted() {
    //console.log("login Status", this.$store.getters.getloginStatus);
    const SID = localStorage.getItem("sessionID");
    if (localStorage.getItem("sessionID") != null) {
      if (SID.length != "") {
        this.validateSession(SID);
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
    padding: 3rem 10px 0 1rem;
  }
  .login_loginform {
    justify-content: space-evenly;
  }
}
</style>
