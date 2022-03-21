<template>
  <div>
    <div v-if="!threeView">
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
          <div class="project_header_settings">
            <SettingIcon :isToggeld="settingsToggeld" @click="toggleSettings" />
          </div>
        </div>
        <div class="project_wrapper">
          <Transition name="show-setting">
            <ProjectSettings v-if="settingsToggeld" @detoggle="settingsToggeld = false" :project="projectData" />
          </Transition>
        </div>

        <div>
          <h3>Search for Something</h3>
          <ReactiveInputField :text="'Search'" @change="typeof $event == 'string' ? (searchText = $event) : ''" />
        </div>

        <Listview :projectData="projectData" :curretLevel="parseInt(curretLevel)" :result="results" @increaseCurrentLevel="increaseCurrentLevel" />

        <button @click="threeView = !threeView" style="width: 200px; height: 200px">TOGGLE 3D VIEW</button>

        <p>parentSelected</p>
        <p>{{ parentSelected }}</p>
        <h6>{{ projectData }}</h6>
      </div>
    </div>
    <Render @detoogle="threeView = false" @newBoxPosition="newBoxPosition" @newBoxscale="newBoxscale" v-if="threeView" :projectData="projectData" />
  </div>
</template>

<script>
import Render from "@/components/Render.vue";
import Listview from "@/components/ListComponent.vue";
import ProjectSettings from "@/components/ProjectSettings.vue";
import SettingIcon from "@/assets/icons/setting.vue";
import ReactiveInputField from "@/components/reactiveInputField.vue";

import io from "socket.io-client";
import api from "@/apiService";

export default {
  components: {
    Render,
    Listview,
    SettingIcon,
    ProjectSettings,
    ReactiveInputField,
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
      threeView: false,
      settingsToggeld: false,
      searchText: "",
      results: [],
    };
  },
  methods: {
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
        this.isLoading = false;
      }
    },
    async addElement() {
      const data = await api.projectcall("projects/addElement", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        child: this.elementToAdd,
        parent: this.parentSelected,
      });
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
    async newBoxPosition(box) {
      const data = await api.projectcall("projects/changePosition", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        element: box.name,
        position: box.parent.position,
      });
      if (!data.isError) {
        this.projectData = {};
        this.projectData.main = data;
      }
    },
    async newBoxscale(data) {
      const box = data.box;
      const scale = data.scale;
      const call = await api.projectcall("projects/changeScale", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        element: box.name,
        scale: scale,
      });
      if (!call.isError) {
        this.projectData = {};
        this.projectData.main = call;
      }
    },
    increaseCurrentLevel(istrue) {
      if (istrue) this.curretLevel++;
      else if (this.curretLevel > 0) this.curretLevel--;
    },
    toggleSettings() {
      this.settingsToggeld = !this.settingsToggeld;
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
        this.projectData = {};
        this.projectData.main = data;
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
    searchText() {
      this.results = [];
      this.allElements.forEach((text) => {
        if (text.includes(this.searchText)) this.results.push(text);
      });
      if (this.searchText == "") this.results = [];
      else if (this.searchText != "" && this.results.length == 0) this.results[0] = -1;
    },
  },
  computed: {
    allElements() {
      return Object.keys(this.projectData.main.pcr);
    },
  },
};
</script>

<style lang="scss">
/* VUE Animations */
.show-setting-enter-active,
.show-setting-leave-active {
  transform: translateX(0);
}

.show-setting-enter-from,
.show-setting-leave-to {
  transform: translateX(100%);
}
/* _______ */

.project_wrapper {
  overflow: hidden;
}
.project_header {
  position: relative;
  display: flex;
  justify-content: space-between;
  background-color: rgb(245, 245, 245);
  box-shadow: 1px 1px 4px 2px rgba(50, 50, 10, 0.2);
  width: calc(100% - 20px);
  z-index: 10;
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

@media only screen and (max-width: 750px) {
  .project_header {
    height: 2rem;
    width: calc(100% - 20px);
    &_detailes {
      display: none;
    }

    &_userInfo {
      display: none;
    }

    &_settings {
      width: 2rem;
    }
  }
}
</style>
