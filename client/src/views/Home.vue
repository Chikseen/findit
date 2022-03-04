<template>
  <div class="home_wrapper">
    <h1>Hello {{ userName }}</h1>
    <div>
      <h2>Your Projects</h2>
      <ProjectCluster :projects="projectCluster.ownProjects" :hasAdd="true" />
    </div>
    <hr />
    <div>
      <h2>Projects Shared by you</h2>
      <ProjectCluster :projects="projectCluster.sharedWithProjects" :sharedbyself="true" />
    </div>
    <hr />
    <div>
      <h2>Projects Shared with you</h2>
      <ProjectCluster :projects="projectCluster.sharedByProjects" />
    </div>
  </div>
</template>

<script>
import ProjectCluster from "../components/projectCluster.vue";

import io from "socket.io-client";
import api from "../apiService";

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
  methods: {
    async getUserData() {
      const data = await api.projectcall("home/projectData/metaData", {
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
      });
      console.log("data", data);
      this.projectCluster = data;
    },
    async checkUserValidation() {
      console.log("checkwith", localStorage.getItem("sessionID"));
      console.log("checkwith", localStorage.getItem("usr"));
      const data = await api.fetchData("session/checkUser", {
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
      });
      this.$store.commit("setloginStatus", await data.status);
      if (!data.status) {
        console.log("Error in user validation");
        localStorage.clear();
        this.$router.push("/login");
      }
    },
  },
  created() {
    this.checkUserValidation();
    this.socket = io(this.$store.getters.getApiSocket);
    this.socket.on("newProjData", (data) => {
      this.projectCluster = data;
    });

    this.socket.on("connect", async function () {
      await api.projectcall("home/projectData/bindUserConnection", {
        userName: localStorage.getItem("usr"),
        socketID: this.id,
      });
    });
  },
  mounted() {
    console.log("login Status", this.$store.getters.getloginStatus);
    this.getUserData();
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
