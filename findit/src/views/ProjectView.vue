<template>
  <div>
    <div>
      <p>project with id {{ projectData.id }}</p>
      <p>Created at {{ projectData.created }}</p>
    </div>
    <button @click="saveProject">Save Project</button>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      ProjectAccessLevel: "",
      projectData: {},
    };
  },
  methods: {
    saveProject() {
      console.log("try to save");
    },
  },
  created() {
    this.socket = io(this.$store.getters.getApiSocket);

    console.log("check if params exits");
    if (this.$route.query.projectid != undefined) {
      console.log("exits");
      sessionStorage.setItem("projectID", this.$route.query.projectid);
    }

    this.socket.on("getUserAccess", (data) => {
      this.ProjectAccessLevel = data.access;
    });
    this.socket.on("projectData", (data) => {
      console.log("projectData", data);
      sessionStorage.setItem("projectID", data.id);
      this.projectData = data;
      this.$router.push({ query: { projectid: data.id } });
    });
  },

  mounted() {
    console.log("try to create", sessionStorage.getItem("projectID"));
    if (sessionStorage.getItem("projectID") == "-1") {
      console.log("create");
      this.socket.emit("createProject", {
        owner: localStorage.getItem("usr"),
      });
    } else if (
      sessionStorage.getItem("projectID") != null &&
      sessionStorage.getItem("projectID") != "undefined"
    ) {
      console.log("getProject", sessionStorage.getItem("projectID"));
      this.socket.emit("getProject", {
        projectID: sessionStorage.getItem("projectID"),
      });
    } else {
      this.$router.push("/login");
    }

    this.socket.emit("checkUserAccess", {
      projectID: sessionStorage.getItem("projectID"),
    });
  },
};
</script>
