<template>
  <div v-if="projectData.main">
    <div class="List_item_setting">
      <Button :text="'Settings'" @mouseup="settingMode = !settingMode" />
    </div>
    <Transition name="show-item-setting" mode="out-in">
      <div v-if="!settingMode">
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
        </div>
      </div>
      <div v-else>
        <div v-if="projectData.main.pcr[parent].childs.length == 0">
          <Button style="background: red" :text="'Delete this Element'" @mouseup="removeChild(parent)" />
        </div>
        <div v-else>
          <p>In Order To delete this Element you have to remove all Childs first!</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import ReactiveInputField from "@/components/reactiveInputField.vue";
import Button from "@/assets/Button.vue";

import api from "../apiService";

export default {
  components: {
    ReactiveInputField,
    Button,
  },
  emits: ["increaseCurrentLevel", "goBack"],
  props: {
    projectData: { type: Object, default: () => {} },
    parent: { type: String, default: "" },
    curretLevel: { type: Number, default: 0 },
  },
  data() {
    return {
      settingMode: false,
    };
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
.show-item-setting-enter-active,
.show-item-setting-leave-active {
  transition: 0.5s ease;
  box-shadow: 2px 2px 4px 2px rgba(50, 50, 10, 0);
}

.show-item-setting-enter-from {
  transform: rotateY(-90deg);
  box-shadow: 2px 2px 4px 2px rgba(50, 50, 10, 0.664);
}
.show-item-setting-leave-to {
  transform: rotateY(90deg);
  box-shadow: 2px 2px 4px 2px rgba(50, 50, 10, 0.623);
}
/* _______ */

.List_item {
  &_setting {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
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
