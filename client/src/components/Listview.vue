<template>
  <div class="projectList" v-if="projectData.main.data">
    <div class="overlook">
      <div v-if="curretLevel - 1 >= 0">
        <h3>All Parents</h3>
        <p v-for="parent in projectData.main.data[curretLevel - 1]" :key="parent + (curretLevel - 1)">
          {{ parent }}
        </p>
      </div>
      <div v-else>
        <h5>There are no parents</h5>
      </div>
    </div>
    <!-- Main Data -->
    <div class="overlook mainDataWrapper">
      <div v-if="projectData.main.data">
        <h3>This Level: {{ curretLevel }}</h3>
        <div class="mainData">
          <div v-for="parent in projectData.main.data[curretLevel]" :key="parent + curretLevel" class="parentlist">
            <h4>
              {{ parent }}
            </h4>
            <div v-for="child in projectData.main.data[curretLevel + 1]" :key="child + curretLevel">
              <p style="margin-left: 40px" v-if="projectData.main.pcr[child].parent == parent">{{ child }}</p>
            </div>
            <div class="addElem">
              <label for="addElem">New element</label>
              <input id="addElem" type="text" @keyup.enter="addElement(parent, $event.target.value)" />
              <button style="background: red" @click="removeChild(parent)">Delete this elem (it has to be empty)</button>
            </div>
          </div>
          <div class="addParent parentlist" v-if="curretLevel == 0">
            <label for="addElem">New element</label>
            <input id="addElem" type="text" @keyup.enter="addElement('', $event.target.value)" />
          </div>
        </div>
      </div>
      <div v-else>
        <h5>Add your first element here</h5>
      </div>
    </div>
    <div class="overlook">
      <div v-if="projectData.main.data[curretLevel + 1]">
        <h3>All Childs</h3>
        <p v-for="parent in projectData.main.data[curretLevel + 1]" :key="parent + (curretLevel + 1)">
          {{ parent }}
        </p>
      </div>
      <div v-else>
        <h5>There are no more childs</h5>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../apiService";

export default {
  props: { projectData: { type: Object, default: {} }, curretLevel: { type: Number, default: 0 } },
  methods: {
    async addElement(parent, child) {
      console.log("add child", child);
      console.log("to parent", parent);
      const data = await api.projectcall("projects/addElement", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        parent: parent,
        child: child,
      });
      console.log("data", data);
      this.projectData.main = data;
    },
    async removeChild(parent) {
      console.log("remove elem", parent);
         const data = await api.projectcall("projects/removeElement", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        parent: parent,
      });
      console.log("data", data);
      this.projectData.main = data; 
    },
  },
};
</script>

<style>
.mainDataWrapper {
  margin: 0;

  background-color: rgb(228, 228, 228);
  padding: 15px;

  text-align: left;
}

.mainDataWrapper > div {
  width: 50%;
}

.mainData {
  background-color: rgb(255, 255, 255);
  padding: 15px;
  width: 100%;
}

.parentlist {
  border: 1px solid;
  border-radius: 10px;
  padding: 15px;
  margin: 15px 0;
}

.addElem {
  display: flex;
  flex-direction: column;
  margin-left: 40px;
}

.addParent {
  display: flex;
  flex-direction: column;
}
</style>
