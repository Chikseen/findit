<template>
  <div class="projectpreview" @mouseup="emitClick">
    <AddIcon v-if="project.id === 'addProject'" class="projectpreview_icon" />
    <h2 v-if="project.id != 'addProject'">{{ project.id.name }}</h2>
    <div class="projectpreview_advancedInfo" v-if="project.id.sharedWith">
      <p>Shared With:</p>
      <p v-for="(name, index) in project.id.sharedWith" :key="index + name">{{ name }}</p>
    </div>
    <div v-if="project.id.sharedBy">
      <p>Shared By:</p>
      <p>{{ project.id.sharedBy }}</p>
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

<style lang="scss">
.projectpreview {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 0;

  &_advancedInfo > p {
    margin: 0;
    padding: 0;
  }

  &_icon {
    width: 100px;
    height: 100px;
    margin: auto;
  }
}

.projectPreview_wrapper {
  width: 100%;
  height: 100%;

  background-color: rgba(187, 193, 197, 0.288);
  border-radius: 50px;

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
