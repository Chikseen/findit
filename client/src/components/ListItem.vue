<template>
  <div v-if="projectData.main">
    <div class="List_item_Setting">
      <button>SETING</button>
    </div>
    <div class="List_item_goUp" v-if="curretLevel != 0">
      <button @mouseup="$emit('goBack')">GOUP</button>
    </div>
    <h4>
      {{ parent }}
    </h4>
    <div @mouseup="$emit('increaseCurrentLevel', child)" v-for="child in projectData.main.data[curretLevel + 1]" :key="child + curretLevel">
      <div v-if="projectData.main.pcr[child].parent == parent" class="parentListChild">
        <p>{{ child }}</p>
      </div>
    </div>
    <div class="addElem">
      <ReactiveInputField
        :text="'Add new Element'"
        submitOnEnter
        @change="typeof $event == 'string' ? (shareWithText = $event) : ''"
        @enter="addElement(parent, $event)"
      />
      <button style="background: red" v-if="projectData.main.pcr[parent].childs.length == 0" @mouseup="removeChild(parent)">Delete this Element</button>
    </div>
  </div>
</template>

<script>
import ReactiveInputField from "@/components/reactiveInputField.vue";

import api from "../apiService";

export default {
  components: {
    ReactiveInputField,
  },
  emits: ["increaseCurrentLevel", "goBack"],
  props: {
    projectData: { type: Object, default: () => {} },
    parent: { type: String, default: "" },
    curretLevel: { type: Number, default: 0 },
  },
  methods: {
    async addElement(parent, child) {
      const data = await api.projectcall("projects/addElement", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        parent: parent,
        child: child,
      });
    },
    async removeChild(parent) {
      if (this.projectData.main.pcr[parent].level != 0) this.goBack();
      const data = await api.projectcall("projects/removeElement", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        parent: parent,
      });
    },
  },
};
</script>

<style lang="scss">
.List_item {
  &_Setting {
    position: absolute;
    top: 10px;
    right: 60px;
    width: 20px;
    height: 20px;
  }

  &_goUp {
    position: absolute;
    top: 10px;
    left: 10px;
    width: 20px;
    height: 20px;
  }
}
</style>
