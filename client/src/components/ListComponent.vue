<template>
  <div class="projectList" v-if="projectData.main.data">
    <div class="overlook mainDataWrapper">
      <div v-if="result[0] == -1">
        <p>There are no results</p>
      </div>
      <div v-if="result.length > 0 && result[0] != -1">
        <div v-for="parent in result" :key="parent + curretLevel" class="parentlist">
          <ListItem :projectData="projectData" :parent="parent" :curretLevel="curretLevel" @increaseCurrentLevel="increaseCurrentLevel" @goBack="goBack" />
        </div>
      </div>
      <div v-if="result[0] != -1 && result.length == 0">
        <div v-if="projectData.main.data">
          <div class="mainData">
            <div v-for="parent in projectData.main.data[curretLevel]" :key="parent + curretLevel">
              <div v-if="watchChild == ''" class="parentlist">
                <ListItem
                  :projectData="projectData"
                  :parent="parent"
                  :curretLevel="curretLevel"
                  @increaseCurrentLevel="increaseCurrentLevel"
                  @goBack="goBack"
                />
              </div>
              <div v-else-if="parent == watchChild" class="parentlist">
                <ListItem
                  :projectData="projectData"
                  :parent="parent"
                  :curretLevel="curretLevel"
                  @increaseCurrentLevel="increaseCurrentLevel"
                  @goBack="goBack"
                />
              </div>
            </div>

            <div class="addParent parentlist" v-if="curretLevel == 0">
              <ReactiveInputField
                :text="'Add new Element'"
                submitOnEnter
                @change="typeof $event == 'string' ? (shareWithText = $event) : ''"
                @enter="addElement('', $event)"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <h5>Add your first element here</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReactiveInputField from "@/components/reactiveInputField.vue";
import ListItem from "@/components/ListItem.vue";

import api from "../apiService";

export default {
  props: {
    projectData: { type: Object, default: {} },
    curretLevel: { type: Number, default: 0 },
    result: { type: Array, default: () => {} },
  },
  emits: ["increaseCurrentLevel"],
  components: {
    ReactiveInputField,
    ListItem,
  },
  data() {
    return {
      watchChild: "",
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
      if (data.isError) this.$store.commit("setMessage", data);
    },
    increaseCurrentLevel(elem) {
      console.log("elem", elem);
      this.watchChild = elem;
      this.$emit("increaseCurrentLevel", true);
    },
    goBack() {
      this.watchChild = this.projectData.main.pcr[this.watchChild].parent;
      if (this.curretLevel - 1 == 0) {
        this.watchChild = "";
      }
      this.$emit("increaseCurrentLevel", false);
    },
  },
  watch: {
    watchChild() {
      this.$emit("newParent", this.watchChild);
    },
  },
};
</script>

<style lang="scss">
.mainDataWrapper {
  margin: 0;
  padding: 15px;
  text-align: left;
  width: calc(100% - 60px);
  max-width: 750px;
}

.mainDataWrapper > div {
  width: 100%;
}

.mainData {
  padding: 15px;
  width: 100%;
}

.parentlist {
  position: relative;
  border: 1px solid #79787852;
  box-shadow: 1px 1px 5px 3px rgba(50, 50, 10, 0.075);
  border-radius: 10px;
  padding: 15px;
  margin: 15px 0;
}

.parentListChild {
  padding: 5px 0 0 20px;
  margin: 10px 0 10px 15px;
  border: 1px solid #adacac33;
  box-shadow: 1px 1px 5px 3px rgba(231, 231, 230, 0.041);
  border-radius: 5px;
  transition: all 0.5s;
}

.parentListChild:hover {
  background-color: antiquewhite;
}

.addElem {
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  width: 100%;
}

.addParent {
  display: flex;
  flex-direction: column;
}
</style>
