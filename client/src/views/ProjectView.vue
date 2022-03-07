<template>
  <div>
    <div>
      <p>project with id {{ projectData.id }}</p>
      <p>Created at {{ projectData.created }}</p>
      <p>Users currectly in this project {{ userdata }}</p>
    </div>
    <button @click="deletProject">delete Project</button>

    <div class="elemHandler">
      <select v-if="projectData.main.data" v-model="curretLevel">
        <option v-for="(level, i) in projectData.main.data.maxLevel + 1" :key="i">
          {{ i }}
        </option>
      </select>
      <select v-if="projectData.main.data" v-model="parentSelected">
        <option></option>
        <option v-for="parent in projectData.main.data[curretLevel]" :key="parent">
          {{ parent }}
        </option>
      </select>
      <input type="text" v-model="elementToAdd" />
      <button @click="addElement">Add</button>
    </div>

    <div>
      <h2>Share this Project with</h2>
      <input type="text" v-model="shareWithText" />
      <button @click="sendInvite">Send Invite</button>
    </div>
    <div class="levelSlider" v-if="projectData.main.data">
      <label for="levelSlider">Current level to watch</label>
      <input id="levelSlider" type="range" v-model="curretLevel" min="0" :max="projectData.main.data.maxLevel + 1" />
      <label for="levelSlider">{{ curretLevel }}</label>
    </div>
    <Listview :projectData="projectData" :curretLevel="parseInt(curretLevel)" @increaseCurrentLevel="increaseCurrentLevel" />
    <Render />

    <h6>{{ projectData }}</h6>
  </div>
</template>

<script>
import Render from "../components/Render.vue";
import Listview from "../components/Listview.vue";

import io from "socket.io-client";
import api from "../apiService";

export default {
  components: {
    Render,
    Listview,
  },
  data() {
    return {
      ProjectAccessLevel: "",
      projectData: { main: {} },
      shareWithText: "",
      elementToAdd: "",
      parentSelected: "",
      userdata: 0,
      curretLevel: 0,
    };
  },
  methods: {
    async deletProject() {
      let val = confirm("Are you sure to want delete this Project");
      if (val == true) {
        const data = await api.projectcall("projects/delete", {
          projectID: this.projectData.id,
          SID: localStorage.getItem("sessionID"),
          user: localStorage.getItem("usr"),
        });
        console.log("data", data);
        this.$router.push("/Home");
      } else {
        console.log("cancel delete request");
      }
    },
    async loadProject() {
      console.log("sending");
      const data = await api.projectcall("projects/load", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
      });
      console.log("data", data);
      if (data.isError) {
        this.$store.commit("setMessage", data);
      } else {
        this.projectData = data;
      }
    },
    async sendInvite() {
      console.log("sendInvite to ", this.shareWithText);
      const data = await api.projectcall("projects/sendInvite", {
        shareWith: this.shareWithText,
        shareBy: localStorage.getItem("usr"),
        projectID: sessionStorage.getItem("projectID"),
      });
      console.log("data", data);
      this.$store.commit("setMessage", data);
    },
    async addElement() {
      const data = await api.projectcall("projects/addElement", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        child: this.elementToAdd,
        parent: this.parentSelected,
      });
      console.log("data", data);
      this.projectData.main = data;
    },
    increaseCurrentLevel(istrue) {
      console.log("istrue", istrue);
      if (istrue) this.curretLevel++;
      else this.curretLevel--;
    },
  },

  created() {
    if (import.meta.env.MODE != "development") {
      window.onbeforeunload = async function () {
        await api.projectcall("projects/removeuserInProj", {
          projectID: sessionStorage.getItem("projectID"),
          socketID: this.id,
        });
      };
    }

    console.log("check if params exits");
    if (this.$route.query.projectid != undefined) {
      console.log("exits");
      sessionStorage.setItem("projectID", this.$route.query.projectid);
    } else {
      console.log("params not exits");
      this.$router.push("/login");
    }

    this.socket = io(this.$store.getters.getApiSocket);
    this.socket.on("newProjData", (data) => {
      console.log("incomming data", data);
      if (!data.isError) {
        this.projectData.main = data;
      }
    });
    this.socket.on("newUserData", (data) => {
      console.log("incomming data", data);
      if (!data.isError) {
        this.userdata = data;
      }
    });

    this.socket.on("connect", async function () {
      await api.projectcall("projects/adduserInProj", {
        projectID: sessionStorage.getItem("projectID"),
        socketID: this.id,
      });
    });

    /*     this.socket.on("getUserAccess", (data) => {
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
        this.$store.commit("setMessage", data);
      if (data.errormsg == "projectremovesuccess") {
        this.$router.push("/home");
      }  
    });*/
  },

  mounted() {
    this.loadProject();
  },
};
</script>

<style>
.elemHandler {
  padding: 20px;
  background-color: aqua;
}
.projectList {
  background-color: bisque;
}
.overlook {
  display: flex;
  flex: row;
}

.levelSlider {
  display: flex;
  flex-direction: column;
  margin: 40px 25%;
}
</style>
