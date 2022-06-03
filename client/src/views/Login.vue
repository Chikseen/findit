<template>
  <div class="login_wrapper">
    <a :href="githubUrl">Github Login</a>
    <a :href="googleUrl">Google Login</a>

    <!--  <div class="login">
      <div class="login_logo">
        <Logo v-if="false" />
      </div>
      <div class="login_header">
        <h2>Store it, Find it, Share</h2>
      </div>
      <form class="login_form" v-if="!validLogin">
        <ReactiveInputField :text="'E-Mail'" @change="typeof $event == 'string' ? (email = $event) : ''" isMail v-if="registerMode" />
        <ReactiveInputField :text="'Username'" @change="typeof $event == 'string' ? (userName = $event) : ''" />
        <ReactiveInputField :text="'Password'" @change="typeof $event == 'string' ? (password = $event) : ''" isPassword />
        <ReactiveInputField :text="'Repeat Password'" @change="typeof $event == 'string' ? (repeatPassword = $event) : ''" isPassword v-if="registerMode" />
      </form>
      <div>
        <CTA class="login_CTA" :text="'Login'" v-if="!registerMode && !validLogin" @mouseup="validateLogin" />
        <CTA class="login_CTA" :text="'Create'" v-if="registerMode && !validLogin" @mouseup="createUser" />
        <Button class="login_buttons" :text="'Create Account'" @mouseup="registerMode = true" v-if="!registerMode && !validLogin" />
        <Button class="login_buttons" :text="'Try login instead'" @mouseup="registerMode = false" v-if="registerMode" />
        <Button class="login_buttons" :text="'Logout'" @mouseup="logout" v-if="validLogin" />
        <Button class="login_buttons" :text="'Home'" @mouseup="tryLogin" v-if="validLogin" />
        <Button class="login_buttons" :text="'Send New Validaiotn'" @mouseup="sendValidaitonCode" v-if="!userValidationStatus" />
      </div>
    </div>  -->
  </div>
</template>

<script>
import Button from "@/assets/Button.vue";
import Logo from "@/assets/icons/logo.vue";
import CTA from "@/assets/CTA.vue";
import ReactiveInputField from "@/components/reactiveInputField.vue";

import api from "@/apiService";

export default {
  name: "Login",
  components: {
    Button,
    CTA,
    Logo,
    ReactiveInputField,
  },
  computed: {
    validLogin() {
      return this.$store.getters.getloginStatus;
    },
    githubUrl() {
      return `https://github.com/login/oauth/authorize?client_id=${process.env.VUE_APP_GITHUB_CLIENT_ID}`;
    },
    googleUrl() {
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.VUE_APP_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.VUE_APP_GOOGLE_REDIRECT}&response_type=code&scope=email profile`;
    },
  },
  data() {
    return {
      userName: "",
      password: "",
      email: "",
      repeatPassword: "",
      registerMode: false,
      number: 0, // Debug
      userValidationStatus: true,
    };
  },
  methods: {
    test(par, par2) {
      console.log("hi", par);
      console.log("hi2", par2);
    },
    async createUser() {
      const data = await api.fetchData("user/createAccount", {
        userName: this.userName,
        email: this.email,
        password: this.password,
        repeatPassword: this.repeatPassword,
      });
      this.$store.commit("setMessage", data);
    },
    async validateLogin() {
      const data = await api.fetchData("user/validateLogin", {
        userName: this.userName,
        password: this.password,
      });
      this.$store.commit("setMessage", data);
      if (data.succes) {
        this.$store.commit("setloginStatus", true);
        localStorage.setItem("sessionID", data.SID);
        localStorage.setItem("usr", this.userName);
        this.tryLogin();
      } else if (data.err == "userNotValidated") {
        console.log("user is not validated");
        this.userValidationStatus = false;
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
        if (data.status) {
          this.$router.push("/Home");
        } else {
          //  localStorage.clear();
          //  this.$store.commit("setloginStatus", false);
        }
      } else {
        localStorage.clear();
        this.$store.commit("setloginStatus", false);
      }
    },
    async sendValidaitonCode() {
      console.log("resendvaliation");
      const data = await api.fetchData("user/reSendValidation", {
        user: this.userName,
      });
      this.$store.commit("setMessage", await data);
    },
    newValue(from, value) {
      console.log("new calue from", from);
      console.log("is", value);
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
  watch: {
    userName() {
      return toString(this.userName);
    },
    password() {
      return toString(this.password);
    },
  },
};
</script>

<style lang="scss">
.login {
  border: 1px solid #bbb9b99c;
  box-shadow: 1px 1px 4px 2px rgba(50, 50, 10, 0.1);
  border-radius: 10px;
  overflow: hidden;

  &_wrapper {
    height: 100%;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

@media only screen and (max-width: 500px) {
  .login {
    overflow: hidden;
    border: none;
    box-shadow: none;

    &_wrapper {
      height: 100%;
      width: calc(100% - 4rem);
      margin: 0 2rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-width: 300px;
    }

    &_CTA {
      height: 4rem;
    }

    &_buttons {
      height: 3rem;
    }
  }
}
</style>
