<template>
  <div class="landing">
    <Render style="margin-top: 20px" v-if="false" />
    <div class="landing_header_wrapper">
      <div class="landing_header">
        <div class="landing_header_logocontainer">
          <Logo />
          <h2>FindIt</h2>
        </div>
        <div class="landing_header_login">
          <CTA :text="'Login'" @click="$router.push('/login')" />
        </div>
      </div>
    </div>
    <div class="landing_title">
      <div class="landing_title_text">
        <div class="landing_title_text_short">
          <Logo />
          <h2>Store it, Find it, Share</h2>
        </div>
        <p>
          With this "Free" Webservice you can organise everything with super esea and even share it. You can create QR codes on the fly and read them in a super
          flexible way. It feature even a 3D visualisation so you don’t even have to use ur brain.
        </p>
      </div>
      <div class="landing_title_picture">
        <h1>HERE SHOULD BE AN PICTURE OF AN EXAMPLE</h1>
      </div>
    </div>

    <div class="landing_detailed">
      <Logo />
      <div class="landing_detailed_text">
        <p>THIS IS AN EXAMPLE TEXT</p>
        <p>THIS IS AN EXAMPLE TEXT</p>
        <p>THIS IS AN EXAMPLE TEXT</p>
      </div>
    </div>

    <hr />
    <hr />
    <hr />
    <h3>here should be dummy projects</h3>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure quia laboriosam ratione est quos molestiae distinctio excepturi maxime inventore, rerum
      placeat libero facilis ex dolores tempore voluptatem doloremque ab aperiam. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Suscipit aliquid qui
      necessitatibus velit sit, dignissimos quo sint consequuntur inventore obcaecati maxime unde repellat nam voluptatem quae fugiat optio reprehenderit
      officiis? Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro voluptatum dolor magnam labore sit! Sapiente quaerat laudantium, quam illo quia
      dignissimos blanditiis amet asperiores, dolores nostrum praesentium, et iste sequi.
    </p>
    <hr />
    <hr />
    <hr />
    <button @mouseup="login">LOGIN</button>
    <div class="footer">
      <p @click="$router.push('/privacyPolicy')">Privacy Policy</p>
    </div>
  </div>
</template>

<script>
import Render from "@/components/Render.vue";
import CTA from "@/assets/CTA.vue";
import Logo from "@/assets/icons/logo.vue";

export default {
  name: "landing",
  components: {
    Render,
    CTA,
    Logo,
  },
  methods: {
    login() {
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss">
.landing {
  position: relative;

  &_header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 1000px;
    max-height: 75px;
    padding: 0 20px;

    &_wrapper {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      background-color: $mainYellow;
      box-shadow: 0px 0px 20px 10px #3f3f3f60;
      z-index: 1;
    }

    &_logocontainer {
      display: flex;
    }

    &_login {
      width: 100px;
      height: 50px;
    }
  }

  &_title {
    display: flex;
    height: 400px;
    max-width: 1000px;
    margin: 100px auto;
    padding: 0 20px;

    &_text {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 50%;

      &_short {
        display: flex;
        flex-direction: row;
        position: relative;
        height: 100%;
      }
    }

    &_picture {
      width: 50%;
      background-color: blueviolet;
    }
  }

  &_detailed {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    max-width: 1000px;
    height: 500px;
    margin: 0 auto;
    padding: 0 20px;

    &_text {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
  }
}
</style>
