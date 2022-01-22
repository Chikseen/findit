<template>
  <div class="home">
    <h1>This is your Home Screen</h1>
    <h3>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quas, magnam
      iusto eveniet explicabo ab fuga debitis. Illum repellat libero voluptas
      unde quasi, labore ratione velit atque cum quod, ad assumenda. Lorem ipsum
      dolor sit amet consectetur adipisicing elit. Esse consectetur enim fuga
      pariatur earum voluptas praesentium aspernatur facilis, molestias, fugiat
      blanditiis? Autem vitae neque omnis libero ullam accusamus officiis
      voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
      libero quia repellendus, temporibus corrupti eveniet saepe cupiditate
      maiores distinctio deleniti voluptatibus consequuntur excepturi est, fugit
      omnis iste eum eius illo.
    </h3>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  name: "Home",
  data() {
    return {
      resviedPositivMessage: false,
    };
  },
  created() {
    this.socket = io(this.$store.getters.getApiSocket);

    console.log("create call");

    this.socket.on("respSID", (data) => {
      console.log("resplog", data.status);
      if (data.status != "valid") {
        localStorage.setItem("sessionID", "");
        this.$router.push("/login");
      } else {
        this.resviedPositivMessage = true;
        console.log("set Login Status true");
        this.$store.commit("setloginStatus", true);
      }
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
    setTimeout(() => {
      console.log("got new Message", this.resviedPositivMessage);
      if (!this.resviedPositivMessage) {
        this.$router.push("/login");
      }
    }, 500);
  },
};
</script>
