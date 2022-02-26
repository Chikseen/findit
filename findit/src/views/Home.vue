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
      <ProjectCluster
        :projects="projectCluster.sharedWithProjects"
        :sharedbyself="true"
      />
    </div>
    <hr />
    <div>
      <h2>Projects Shared with you</h2>
      <ProjectCluster :projects="projectCluster.sharedByProjects" />
    </div>
    <button @click="test">TEST</button>
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
    test() {
      console.log("test socket id");
      this.socket.emit("testID");
    },
    async getUserData() {
      if (this.$store.getters.getloginStatus) {
        const data = await api.projectcall("projectData/metaData", {
          SID: localStorage.getItem("sessionID"),
          user: localStorage.getItem("usr"),
        });
        console.log("data", data);
        this.projectCluster = data;
      } else {
        localStorage.clear();
        this.$router.push("/login");
      }
    },
  },
  created() {
    this.socket = io(this.$store.getters.getApiSocket);
    console.log("create call");

    this.socket.on("respSID", (data) => {
      console.log("resplog", data.status);
      if (data.status != "valid") {
        localStorage.setItem("sessionID", "");
        //this.$router.push("/login");
      } else {
        this.resviedPositivMessage = true;
        console.log("set Login Status true");
        this.$store.commit("setloginStatus", true);
      }
    });

    this.socket.on("currentUserData", (data) => {
      this.userData = data;
    });
    /*     this.socket.on("getProjectData", (data) => {
      console.log("get Project Data", data);
      this.projectCluster = data;
    }); */
    this.socket.on("response", (data) => {
      console.log("data", data);
      this.$store.commit("setMessage", data);
    });
  },
  mounted() {
    console.log("login Status", this.$store.getters.getloginStatus);
    this.getUserData();

    const SID = localStorage.getItem("sessionID");
    if (localStorage.getItem("sessionID") != null) {
      if (SID.length != "") {
        console.log("confrom Login", SID);
        this.socket.emit("checkSID", {
          SID: SID,
        });
      }
    }
    this.socket.emit("bindUserConnection", {
      userName: localStorage.getItem("usr"),
    });

    /*     this.socket.emit("requestProjectData", {
      userName: localStorage.getItem("usr"),
    });
    setTimeout(() => {
      if (!this.resviedPositivMessage) {
      //  this.$router.push("/login");
      }
    }, 200); */
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
