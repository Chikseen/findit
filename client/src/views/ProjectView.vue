<template>
  <div>
    <div v-if="isLoading">
      <h1>Page is Loading</h1>
    </div>
    <div v-if="!isLoading">
      <div class="project_header">
        <div class="project_header_metaInfo">
          <div class="project_header_projName">
            <input class="project_header_projName_input" v-model="projectName" @blur="setNewProjname($event.target.value)" />
          </div>
          <div class="project_header_detailes">
            <p>Project ID: {{ projectData.id }}</p>
            <p>Created At: {{ projectData.created }}</p>
          </div>
        </div>
        <div class="project_header_userInfo">
          <p>Currently watching: {{ userdata.user }}</p>
          <p>This project is shared with: {{ projectData.sharedWith }}</p>
        </div>
      </div>
      <button @mouseup="deletProject">delete Project</button>

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
        <button @mouseup="addElement">Add</button>
      </div>

      <div>
        <h2>Share this Project with</h2>
        <input type="text" v-model="shareWithText" />
        <button @mouseup="sendInvite">Send Invite</button>
      </div>

      <Listview
        :projectData="projectData"
        :curretLevel="parseInt(curretLevel)"
        @increaseCurrentLevel="increaseCurrentLevel"
        @newParent="typeof $event == 'string' ? (parentSelected = $event) : ''"
      />

      <p>parentSelected</p>
      <p>{{ parentSelected }}</p>
      <p>numberOfBoxesToRender</p>
      <p>{{ numberOfBoxesToRender }}</p>
      <Render :numberOfBoxesToRender="numberOfBoxesToRender" :numberOfBoxesToRenderChild="numberOfBoxesToRenderChild" />
      <h6>{{ projectData }}</h6>
    </div>
  </div>
</template>

<script>
import Render from "../components/Render.vue";
import Listview from "../components/ListComponent.vue";

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
      projectName: "",
      userdata: 0,
      curretLevel: 0,
      isLoading: true,
      numberOfBoxesToRender: 0,
      numberOfBoxesToRenderChild: [],
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
        this.$router.push("/Home");
      } else {
        console.log("cancel delete request");
      }
    },
    async loadProject() {
      const data = await api.projectcall("projects/load", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
      });
      if (data.isError) {
        this.$store.commit("setMessage", data);
      } else {
        this.projectData = data;
        this.projectName = data.name;
        if (this.projectData.main.data[0]) {
          this.numberOfBoxesToRender = this.projectData.main.data[0].length;
          this.projectData.main.data[0].forEach((elm) => {
            this.numberOfBoxesToRenderChild.push(this.projectData.main.pcr[elm].childs.length);
          });
        }
        this.isLoading = false;
      }
    },
    async sendInvite() {
      const data = await api.projectcall("projects/sendInvite", {
        shareWith: this.shareWithText,
        shareBy: localStorage.getItem("usr"),
        projectID: sessionStorage.getItem("projectID"),
      });
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
      if (data.data[0]) {
        this.numberOfBoxesToRender = data.data[0].length;
        data.data[0].forEach((elm) => {
          this.numberOfBoxesToRenderChild.push(data.pcr[elm].childs.length);
        });
      }
      this.projectData.main = data;
    },
    async setNewProjname(name) {
      if (name != this.projectData.name) {
        if (name.length >= 3) {
          const data = await api.projectcall("projects/setNewName", {
            projectID: sessionStorage.getItem("projectID"),
            SID: localStorage.getItem("sessionID"),
            user: localStorage.getItem("usr"),
            name: name,
          });
          this.projectData.name = data.name;
          this.projectName = data.name;
        } else {
          console.log("The project is to short");
          this.projectName = this.projectData.name;
          this.$store.commit("setMessage", {
            isError: true,
            msg: "The project is to short",
          });
        }
      } else {
        console.log("The project name cant be the same");
        this.projectName = this.projectData.name;
        this.$store.commit("setMessage", {
          isError: true,
          msg: "The project name cant be the same",
        });
      }
    },
    increaseCurrentLevel(istrue) {
      if (istrue) this.curretLevel++;
      else if (this.curretLevel > 0) this.curretLevel--;
    },
  },

  created() {
    if (process.env.NODE_ENV != "development") {
      window.onbeforeunload = async function () {
        await api.projectcall("projects/removeuserInProj", {
          projectID: sessionStorage.getItem("projectID"),
          socketID: this.id,
        });
      };
    }

    if (this.$route.query.projectid != undefined) {
      sessionStorage.setItem("projectID", this.$route.query.projectid);
    } else {
      this.$router.push("/login");
    }

    this.socket = io(this.$store.getters.getApiSocket);
    this.socket.on("newProjData", (data) => {
      if (!data.isError) {
        this.projectData.main = data;
        if (data.data[0]) {
          this.numberOfBoxesToRender = data.data[0].length;
          data.data[0].forEach((elm) => {
            this.numberOfBoxesToRenderChild.push(data.pcr[elm].childs.length);
          });
        }
      }
    });
    this.socket.on("newUserData", (data) => {
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
  },
  mounted() {
    this.loadProject();
  },
  watch: {
    parentSelected() {
      if (this.curretLevel == 0) {
        console.log(this.projectData.main.data[0].length);
        this.numberOfBoxesToRender = this.projectData.main.data[0].length;
      }
    },
  },
};
</script>

<style lang="scss">
.project_header {
  position: relative;
  display: flex;
  justify-content: space-between;
  background-color: rgb(209, 209, 221);
  width: calc(100% - 20px);
  height: 5rem;
  padding: 10px;

  &_metaInfo {
    display: flex;
  }

  &_projName {
    display: flex;
    width: 15rem;

    &_input {
      width: 100%;
      font-size: 1.75rem;
      background-color: rgba(0, 0, 0, 0);
      border: 0;
      border-right: 1px solid;
      border-radius: 10px;
    }
  }

  &_detailes {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 0 10px;
  }
  &_detailes p {
    margin: auto 0;
    text-align: start;
  }

  &_userInfo {
    max-width: 20rem;
  }
}

/* __________________ */

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
