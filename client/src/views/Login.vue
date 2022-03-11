<template>
  <div class="login_wrapper">
    <div class="login">
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
      <div class="login_buttons">
        <CTA :text="'Login'" v-if="!registerMode && !validLogin" @mouseup="validateLogin" />
        <CTA :text="'Create'" v-if="registerMode && !validLogin" @mouseup="createUser" />
        <Button :text="'Create Account'" @mouseup="registerMode = true" v-if="!registerMode && !validLogin" />
        <Button :text="'Try login instead'" @mouseup="registerMode = false" v-if="registerMode" />
        <Button :text="'Logout'" @mouseup="logout" v-if="validLogin" />
        <Button :text="'Home'" @mouseup="tryLogin" v-if="validLogin" />
        <Button :text="'Send New Validaiotn'" @mouseup="sendValidaitonCode" v-if="!userValidationStatus" />
      </div>
      <!-- 
      <div class="login_loginform" v-if="!validLogin">
        <div class="login_loginform-selection">
          <form action="#">
            <div class="login_loginform_wrapper">
              <div class="login_loginform_input">
                <label for="loginUserName">Username</label>
                <input id="loginUserName" type="email" placeholder="Username" autocomplete="userName" v-model="userName" />
              </div>
              <div class="login_loginform_input" v-if="registerMode">
                <label for="loginUserPassword">E-mail</label>
                <input type="email" placeholder="E-mail" v-model="email" />
              </div>
              <div class="login_loginform_input">
                <label for="loginUserPassword">Password</label>
                <input type="password" id="loginUserPassword" placeholder="Password" autocomplete="current-password" v-model="password" />
              </div>
              <div class="login_loginform_input" v-if="registerMode">
                <label for="loginUserPassword">Repeat password</label>
                <input type="password" placeholder="Repeat password" v-model="repeatPassword" />
              </div>
            </div>
            <div></div>
          </form>
        </div>
        <div class="login_loginform-selection">
          <div class="login_loginform_input" v-if="!registerMode">
            <Button :text="'Login'" @mouseup="validateLogin" />
          </div>
          <div class="login_loginform_input" v-if="registerMode">
            <Button :text="'Register'" @mouseup="createUser" />
          </div>
          <div class="login_loginform_input" v-if="!registerMode">
            <Button :text="'Create Account'" @mouseup="registerMode = true" />
          </div>
          <div class="login_loginform_input" v-if="registerMode">
            <Button :text="'I have a Account'" @mouseup="registerMode = false" />
          </div>
          <div class="login_loginform_input" v-if="!userValidationStatus">
            <Button :text="'Send New Validaiotn'" @mouseup="sendValidaitonCode" />
          </div>
        </div>
      </div>
      <div v-else>
        <div class="login_loginform_input">
          <Button :text="'Logout'" @mouseup="logout" />
          <Button :text="'Home'" @mouseup="tryLogin" />
        </div>
      </div> -->
    </div>
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
  border: 1px solid;
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

/* 
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
} */
</style>
