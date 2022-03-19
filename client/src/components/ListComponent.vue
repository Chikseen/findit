<template>
  <div class="projectList" v-if="projectData.main.data">
    <div class="levelSlider" v-if="watchChild == ''">
      <label for="levelSlider">Current level to watch</label>
      <input id="levelSlider" type="range" v-model="curretLevel" min="0" :max="projectData.main.data.maxLevel" />
      <label for="levelSlider">{{ curretLevel }}</label>
    </div>
    <!--     <div class="overlook">
      <div v-if="curretLevel - 1 >= 0">
        <h3>All Parents</h3>
        <p v-for="parent in projectData.main.data[curretLevel - 1]" :key="parent + (curretLevel - 1)">
          {{ parent }}
        </p>
      </div>
      <div v-else>
        <h5>There are no parents</h5>
      </div>
    </div> -->

    <!-- Main Data -->
    <div class="overlook mainDataWrapper">
      <div v-if="projectData.main.data">
        <div class="mainData">
          <div v-for="parent in projectData.main.data[curretLevel]" :key="parent + curretLevel">
            <div v-if="watchChild == ''" class="parentlist">
              <!-- SAME AS THIS, CHANGE -->
              <h4>
                {{ parent }}
              </h4>
              <div @mouseup="increaseCurrentLevel(child)" v-for="child in projectData.main.data[curretLevel + 1]" :key="child + curretLevel">
                <div v-if="projectData.main.pcr[child].parent == parent" class="parentListChild">
                  <p>{{ child }}</p>
                </div>
              </div>
              <div class="addElem">
                <label for="addElem">New element</label>
                <input id="addElem" type="text" :ref="'Ichild' + parent" @keyup.enter="addElement(parent, $event.target.value, 'Ichild' + parent)" />
                <button style="background: red" @mouseup="removeChild(parent)">Delete this elem (it has to be empty)</button>
              </div>
            </div>
            <div v-else-if="parent == watchChild" class="parentlist">
              <button @mouseup="goBack">Go Up</button>
              <!-- SAME AS THIS, CHANGE -->
              <h4>
                {{ parent }}
              </h4>
              <div @mouseup="increaseCurrentLevel(child)" v-for="child in projectData.main.data[curretLevel + 1]" :key="child + curretLevel">
                <div v-if="projectData.main.pcr[child].parent == parent" class="parentListChild">
                  <p>{{ child }}</p>
                </div>
              </div>
              <div class="addElem">
                <label for="addElem2">New element</label>
                <input id="addElem2" type="text" :ref="'Ichild' + parent" @keyup.enter="addElement(parent, $event.target.value, 'Ichild' + parent)" />
                <button style="background: red" @mouseup="removeChild(parent)">Delete this elem (it has to be empty)</button>
              </div>
            </div>
          </div>
          <div class="addParent parentlist" v-if="curretLevel == 0">
            <label for="addElem3">New element</label>
            <input id="addElem3" type="text" :ref="'Iroot'" @keyup.enter="addElement('', $event.target.value, 'Iroot')" />
          </div>
        </div>
      </div>
      <div v-else>
        <h5>Add your first element here</h5>
      </div>
    </div>
    <!--   <div class="overlook">
      <div v-if="projectData.main.data[curretLevel + 1]">
        <h3>All Childs</h3>
        <p v-for="parent in projectData.main.data[curretLevel + 1]" :key="parent + (curretLevel + 1)">
          {{ parent }}
        </p>
      </div>
      <div v-else>
        <h5>There are no more childs</h5>
      </div>
    </div> -->
  </div>
</template>

<script>
import api from "../apiService";

export default {
  props: { projectData: { type: Object, default: {} }, curretLevel: { type: Number, default: 0 } },
  emits: ["increaseCurrentLevel"],
  data() {
    return {
      watchChild: "",
    };
  },
  methods: {
    async addElement(parent, child, ref) {
      const data = await api.projectcall("projects/addElement", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        parent: parent,
        child: child,
      });
      this.$refs[ref].value = "";
      this.projectData.main = data;
    },
    async removeChild(parent) {
      if (this.projectData.main.pcr[parent].level != 0) this.goBack();
      const data = await api.projectcall("projects/removeElement", {
        projectID: sessionStorage.getItem("projectID"),
        SID: localStorage.getItem("sessionID"),
        user: localStorage.getItem("usr"),
        parent: parent,
      });
      this.projectData.main = data;
    },
    increaseCurrentLevel(elem) {
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

.parentListChild {
  padding: 5px 0 0 20px;
  margin: 10px 0 10px 15px;
  border: 1px solid;
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
}

.addParent {
  display: flex;
  flex-direction: column;
}
</style>
