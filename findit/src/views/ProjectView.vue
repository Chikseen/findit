<template>
  <div>
    <div>
      <p>project with id {{ projectData.id }}</p>
      <p>Created at {{ projectData.created }}</p>
    </div>
    <button @click="deletProject">delete Project</button>

    <div class="elemHandler">
      <select name="cars" id="cars" v-model="parentSelected">
        <!--    <option v-for="elem in elems" :key="elem">{{ elem }}</option> -->
      </select>
      <input type="text" v-model="elementToAdd" />
      <button @click="addElement">Add</button>
    </div>

    <div>
      <h2>Share this Project with</h2>
      <input type="text" v-model="shareWithText" />
      <button @click="sendInvite">Send Invite</button>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      ProjectAccessLevel: "",
      projectData: {},
      shareWithText: "",
      elementToAdd: "",
      parentSelected: "",
    };
  },
  methods: {
    deletProject() {
      let val = confirm("Are you sure to want delete this Project");
      if (val == true) {
        this.socket.emit("deleteProject", {
          projectID: this.projectData.id,
          owner: localStorage.getItem("usr"),
        });
      } else {
        console.log("cancel delete request");
      }
    },
    sendInvite() {
      if (this.shareWithText != "") {
        this.socket.emit("shareProject", {
          shareWith: this.shareWithText,
          shareBy: localStorage.getItem("usr"),
          projectID: sessionStorage.getItem("projectID"),
        });
      }
    },
    addElement() {
      this.socket.emit("addElementToParent", {
        project: sessionStorage.getItem("projectID"),
        parent: this.parentSelected,
        toAdd: this.elementToAdd,
      });
    },
  },

  created() {
    this.socket = io(this.$store.getters.getApiSocket);

    console.log("check if params exits");
    if (this.$route.query.projectid != undefined) {
      console.log("exits");
      sessionStorage.setItem("projectID", this.$route.query.projectid);
    } else {
      console.log("params not exits");
      this.$router.push("/login");
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
    this.socket.on("response", (data) => {
      console.log("data", data);
      this.$store.commit("setMessage", data);
      if (data.errormsg == "projectremovesuccess") {
        this.$router.push("/home");
      }
    });
    this.socket.on("projectStructure", (data) => {
      console.log("data", data);
      /*  this.$store.commit("setMessage", data);
      if (data.errormsg == "projectremovesuccess") {
        this.$router.push("/home");
      } */
    });
  },

  mounted() {
    console.log("try to create", sessionStorage.getItem("projectID"));
    if (sessionStorage.getItem("projectID") == "-1") {
      if (
        localStorage.getItem("usr") &&
        sessionStorage.getItem("projectID") == "-1"
      ) {
        console.log("create");
        this.socket.emit("createProject", {
          owner: localStorage.getItem("usr"),
        });
      } else {
        this.$router.push("/home");
      }
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

<style>
.elemHandler {
  padding: 20px;
  background-color: aqua;
}
</style>
