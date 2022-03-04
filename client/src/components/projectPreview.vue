<template>
  <div class="projectPreview_wrapper" @click="emitClick">
    <div v-if="project.id === 'addProject'">
      <AddIcon />
    </div>
    <div v-else>
      <h6>SHOW PROJECT HERE</h6>
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
  min-width: 100px;
  min-height: 100px;
  padding: 50px;

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
