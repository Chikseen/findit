<template>
  <div class="" @mouseup="emitClick">
    <AddIcon v-if="project.id === 'addProject'" />
    <h1>{{ project.id.name }}</h1>
    <h5 v-if="!project.id.sharedWith && !project.id.sharedBy">{{ project.id.projectID }}</h5>
    <div v-if="project.id.sharedWith">
      <h3>Shared With:</h3>
      <h4 v-for="(name, index) in project.id.sharedWith" :key="index + name">{{ name }}</h4>
    </div>
    <div v-if="project.id.sharedBy">
      <h3>Shared By:</h3>
      <h4>{{ project.id.sharedBy }}</h4>
    </div>
  </div>
</template>

<script>
import AddIcon from "../assets/icons/add.vue";

export default {
  components: {
    AddIcon,
  },
  props: {
    project: { type: Object, default: () => {} },
  },
  methods: {
    emitClick() {
      this.$emit("click");
    },
  },
};
</script>

<style>
.projectPreview_wrapper {
  width: 100%;
  height: 100%;

  background-color: rgba(187, 193, 197, 0.288);
  border-radius: 10px;

  transition: all 0.5s;
}
.projectPreview_wrapper:hover {
  min-width: 120px;
  min-height: 120px;
  padding: 40px;
}
@media only screen and (max-width: 650px) {
  .projectPreview_wrapper {
    width: 5rem;
    height: 5rem;
    padding: 2rem;
  }
}
</style>
