<template>
  <div class="projectCluster_wrapper">
    <p v-if="projects.length == 0">Looks quiet empty here</p>
    <div class="projectcluster_preview">
      <ProjectPreview
        class="projectcluster_project"
        :project="{ id: 'addProject' }"
        @click="goToProject('-1')"
      />
      <div
        class="projectcluster_project"
        v-for="proj in projects"
        :key="proj"
        @click="goToProject(proj)"
      >
        <ProjectPreview :project="{ id: proj }" />
        <p>{{ proj }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectPreview from "./projectPreview.vue";

export default {
  name: "projects",
  components: {
    ProjectPreview,
  },
  props: {
    projects: { type: Array, default: () => [] },
  },
  methods: {
    goToProject(projectID) {
      console.log("go to Project with id", projectID);
      sessionStorage.setItem("projectID", projectID);
      this.$router.push({
        name: "ProjectView",
        params: { projectid: projectID },
      });
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
