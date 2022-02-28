<template>
  <div class="projectCluster_wrapper">
    <p v-if="projects.length == 0">Looks quiet empty here</p>
    <div class="projectcluster_preview">
      <ProjectPreview class="projectcluster_project" :project="{ id: 'addProject' }" @click="goToProject('-1')" v-if="hasAdd" />
      <div class="projectcluster_project" v-for="proj in projects" :key="proj" @click="goToProject(proj)">
        <ProjectPreview :project="{ id: proj }" />
        <div v-if="sharedbyself"></div>
        <p>{{ proj }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectPreview from "./projectPreview.vue";

import api from "../apiService";

export default {
  name: "projectCluster",
  components: {
    ProjectPreview,
  },
  props: {
    projects: { type: Array, default: () => [] },
    hasAdd: { type: Boolean, default: false },
    sharedbyself: { type: Boolean, default: false },
    sharedfrom: { type: Boolean, default: false },
  },
  methods: {
    async goToProject(projectID) {
      const data = await api.projectcall("projects/loading", {
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        projectID: projectID,
      });
      console.log("data", data);
      if (toString(data.id).length == 18) {
        sessionStorage.setItem("projectID", data.id);

        this.$router.push({
          name: "ProjectView",
          query: { projectid: data.id },
        });
      } else {
        console.log("projecthandling: an error eccoured");
      }
    },
  },
};
</script>

<style>
.projectcluster_preview {
  display: flex;
  flex-direction: row;
  height: 250px;
}
.projectcluster_project {
  margin: 0 10px;

  width: auto;
  height: 100px;
}
@media only screen and (max-width: 650px) {
  .projectCluster_wrapper {
    overflow-x: scroll;
  }
}
</style>
