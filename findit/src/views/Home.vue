<template>
  <div class="home_wrapper">
    <h1>Hello {{ userName }}</h1>
    <div>
      <h2>Your Projects</h2>
      <ProjectCluster :projects="projectCluster.ownProjects" />
    </div>
    <hr />
    <div>
      <h2>Projects Shared by you</h2>
      <ProjectCluster :projects="projectCluster.sharedByProjects" />
    </div>
    <hr />
    <div>
      <h2>Projects Shared with you</h2>
      <ProjectCluster :projects="projectCluster.sharedWithProjects" />
    </div>
  </div>
</template>

<script>
import ProjectCluster from "../components/projectCluster.vue";

import io from "socket.io-client";

export default {
  name: "Home",
  components: {
    ProjectCluster,
  },
  data() {
    return {
      resviedPositivMessage: false,
      userData: {},
      projectCluster: {},
    };
  },
  computed: {
    userName() {
      return localStorage.getItem("usr");
    },
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

    this.socket.on("currentUserData", (data) => {
      this.userData = data;
    });
    this.socket.on("getProjectData", (data) => {
      this.projectCluster = data;
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
    this.socket.emit("requestProjectData", {
      userName: localStorage.getItem("usr"),
    });
    setTimeout(() => {
      if (!this.resviedPositivMessage) {
        this.$router.push("/login");
      }
    }, 500);
  },
};
</script>

<style>
  .home_wrapper {
    padding: 0 50px;
    max-width: 1250px;
    margin: 0 auto;
  }
</style>
