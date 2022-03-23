<template>
  <div class="projectCluster_wrapper">
    <p v-if="projects.length == 0">Looks quiet empty here</p>
    <div class="projectcluster_preview">
      <ProjectPreview class="projectcluster_project" :project="{ id: 'addProject' }" @mouseup="goToProject('-1')" v-if="hasAdd" />
      <div class="projectcluster_project" v-for="proj in projects" :key="proj" @mouseup="goToProject(proj)">
        <ProjectPreview :project="{ id: proj }" />
        <div v-if="sharedbyself"></div>
      </div>
    </div>
  </div>
</template>
<script>
import ProjectPreview from "@/components/ProjectPreview.vue";
import api from "@/apiService";

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
    async goToProject(goto) {
      let projectID;
      if (typeof goto == "object") {
        projectID = goto.projectID;
      } else {
        projectID = goto;
      }
      const id = await api.projectcall("projects/getID", {
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        projectID: projectID,
      });
      if (toString(id).length == 18) {
        sessionStorage.setItem("projectID", id);

        this.$router.push({
          name: "ProjectView",
          query: { projectid: id },
        });
      } else {
        console.log("projecthandling: an error eccoured");
      }
    },
  },
};
</script>

<style lang="scss">
.projectcluster {
  &_preview {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12.5px;
  }
  &_project {
    height: 250px;
    min-width: 200px;
    background-color: $main-lighter;
    border-radius: 10px;
    box-shadow: 2px 2px 10px 1px rgba(50, 50, 10, 0.1);
    cursor: pointer;
    transition: all 0.2s;
  }

  &_project:hover {
    box-shadow: 2px 2px 10px 1px rgba(50, 50, 10, 0.2);
  }
}

@media only screen and (max-width: 500px) {
  .projectcluster {
    &_preview {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 10px;
    }
    &_project {
      height: 150px;
      min-width: 100px;
    }
    &_project > h1 {
      font-size: 0.75rem;
    }
  }
}
</style>
