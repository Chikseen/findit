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
      const data = await api.fetchData("user/createAccount", {
        userName: this.username,
        passwort: this.passwort,
        repeatPasswort: this.repeatPasswort,
      });
      console.log("createUser", await data);
      this.$store.commit("setMessage", data);
    },
    async validateLogin() {
      const data = await api.fetchData("user/validateLogin", {
        userName: this.username,
        passwort: this.passwort,
      });
      this.$store.commit("setMessage", data);
      if (data.succes) {
        this.$store.commit("setloginStatus", true);
        localStorage.setItem("sessionID", data.SID);
        localStorage.setItem("usr", this.username);
        this.tryLogin();
      }
    },
    async logout() {
      const data = await api.fetchData("session/destroy", {
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
      });
      this.$store.commit("setMessage", data);
      this.$store.commit("setloginStatus", false);
      localStorage.clear();
    },

    async validateSession(SID) {
      const data = await api.fetchData("session/validate", {
        SID: SID,
        user: localStorage.getItem("usr"),
      });
      console.log("isValid", data);
      if (data.status) {
        this.$store.commit("setloginStatus", true);
        localStorage.setItem("sessionID", SID);
      } else {
        this.$store.commit("setloginStatus", false);
        localStorage.clear();
      }
    },
    async tryLogin() {
      if (this.$store.getters.getloginStatus) {
        const data = await api.fetchData("session/checkUser", {
          SID: localStorage.getItem("sessionID"),
          user: localStorage.getItem("usr"),
        });
        console.log("data", data);
        if (data.status) {
          this.$router.push("/Home");
        } else {
          localStorage.clear();
          this.$store.commit("setloginStatus", false);
        }
      } else {
        localStorage.clear();
        this.$store.commit("setloginStatus", false);
      }
    },
  },
  computed: {
    validLogin() {
      return this.$store.getters.getloginStatus;
    },
  },
  mounted() {
    const SID = localStorage.getItem("sessionID");
    if (SID != null) {
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
