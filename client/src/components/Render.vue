<template>
  <div @mousedown="saveMouseDown" @mouseup="click" class="mainWindow">
    <ControllPanel
      v-if="projectData.main.data"
      :maxLevel="projectData.main.data.maxLevel"
      @detoogle="$emit('detoogle')"
      @main_selected="main_selected = $event"
      @scale_selected="scale_selected = $event"
      @level_selected="level_selected = $event"
    />
    <Renderer ref="rendererC" antialias alpha class="render-wrapper" resize="window" orbit-ctrl>
      <Camera ref="camera" :position="{ z: 150, x: 0, y: 0 }" :fov="100" />
      <Scene ref="scene">
        <PointLight :position="{ y: 20, z: 100, x: 100 }" :intensity="0" />
        <PointLight :position="{ y: 20, z: 100, x: 100 }" />
        <AmbientLight color="#aaaaaa" :intensity="0.3" />

        <Sphere :position="{ x: 0, y: 0, z: 0 }" :radius="5">
          <LambertMaterial />
        </Sphere>

        <div v-if="projectData.main.data">
          <Group v-for="(item, index) in projectData.main.data[0]" :key="index">
            <!-- Print Main BOX -->
            <div v-if="projectData.main.pcr[item].position">
              <BoxFrame
                ref="boxframe"
                :projectData="projectData.main.pcr"
                :position="projectData.main.pcr[item].position"
                :boxScale="projectData.main.pcr[item].scale"
                :setName="item"
              />
            </div>
            <div v-else>
              <BoxFrame
                ref="boxframe"
                :projectData="projectData.main.pcr"
                :position="{ x: 100 * index }"
                :boxScale="projectData.main.pcr[item].scale"
                :setName="item"
                :text="'HELLO'"
              />
            </div>
          </Group>
          <!-- <BoxFrame ref="boxframe" :position="{ x: -100, y: -210 }" :boxScale="{ x: 50, y: 50, z: 50 }" :setName="item" :text="'PP'" />-->
        </div>
      </Scene>
    </Renderer>
  </div>
</template>

<script>
import BoxFrame from "./render/BoxFrame.vue";
import ControllPanel from "./render/ControllPanel.vue";
import { Raycaster, Vector2 } from "three-full";

let raycaster = new Raycaster();
let pointer = new Vector2();
let allChilds = [];

export default {
  components: {
    BoxFrame,
    ControllPanel,
  },
  props: {
    projectData: { type: Object, default: () => {} },
  },
  data() {
    return {
      yoffset: 0,
      xoffset: 0,
      zoffset: 1,
      yscale: 1,
      xscale: 1,
      zscale: 1,
      mouseDown: { x: 0, y: 0 },
      main_selected: 0,
      scale_selected: 0,
      level_selected: 0,
    };
  },
  methods: {
    getcurrentdata() {
      console.log("get box data", this.$refs.boxframe);
    },
    onPointerEvent() {
      console.log("hi");
    },
    getAllChilds(group) {
      group.forEach((child) => {
        if (child.type === "Group") {
          this.getAllChilds(child.children);
        } else {
          allChilds.push(child);
        }
      });
    },
    saveMouseDown(event) {
      this.mouseDown.x = event.clientX;
      this.mouseDown.y = event.clientY;
    },
    click(event) {
      if (this.mouseDown.x == event.clientX && this.mouseDown.y == event.clientY) {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, this.$refs.camera.camera);

        allChilds = [];
        if (this.$refs.scene.scene.children.length > 0) {
          this.getAllChilds(this.$refs.scene.scene.children);
        }
        const intersects = raycaster.intersectObjects(allChilds);
        const filterMesh = intersects.filter((element) => this.projectData.main.pcr[element.object.name]);
        const result = filterMesh.filter((element) => this.projectData.main.pcr[element.object.name].level == this.level_selected);

        if (event.clientX > 240 || event.clientY > 270) {
          if (result[0]) {
            const box = result[0];
            switch (parseInt(this.main_selected)) {
              case 0: {
                this.changePostion(box);
                break;
              }
              case 1: {
                this.changeScale(box);
                break;
              }
              case 2: {
                console.log("not supported yet");
                break;
              }
            }
          } else {
            console.log("sometginh went wrong in the box replacement proccess");
          }
        } else {
          console.log("box click");
        }
      } else {
        console.log("mouse movment dont move block");
      }
    },
    changePostion(box) {
      // 0 1, - x
      if (box.faceIndex >= 0 && box.faceIndex <= 11) {
        const pushBy = 10;
        if (box.faceIndex == 0 || box.faceIndex == 1) {
          box.object.parent.position.setX(box.object.parent.position.x - pushBy);
        }
        // 2 3 , + x
        else if (box.faceIndex == 2 || box.faceIndex == 3) {
          box.object.parent.position.setX(box.object.parent.position.x + pushBy);
        }
        // 4 5 , - y
        else if (box.faceIndex == 4 || box.faceIndex == 5) {
          box.object.parent.position.setY(box.object.parent.position.y - pushBy);
        }
        // 6 7 , + y
        else if (box.faceIndex == 6 || box.faceIndex == 7) {
          box.object.parent.position.setY(box.object.parent.position.y + pushBy);
        }
        // 8 9 , - z
        else if (box.faceIndex == 8 || box.faceIndex == 9) {
          box.object.parent.position.setZ(box.object.parent.position.z - pushBy);
        }
        // 10 11 , + z
        else if (box.faceIndex == 10 || box.faceIndex == 11) {
          box.object.parent.position.setZ(box.object.parent.position.z + pushBy);
        }
        this.$emit("newBoxPosition", box.object);
      }
    },
    changeScale(box) {
      if (box.faceIndex >= 0 && box.faceIndex <= 11) {
        let pushBy = 10;

        if (parseInt(this.scale_selected) == 1) pushBy = parseInt(`-${pushBy}`);

        let scale;
        if (this.projectData.main.pcr[box.object.name].scale) scale = this.projectData.main.pcr[box.object.name].scale;
        else scale = { x: 100, y: 100, z: 100 };

        // 0 1, - x
        if (box.faceIndex == 0 || box.faceIndex == 1) {
          if (scale.x > pushBy) scale.x = scale.x - pushBy;
          this.$emit("newBoxscale", { box: box.object, scale: scale });
        }
        // 2 3 , + x
        else if (box.faceIndex == 2 || box.faceIndex == 3) {
          if (scale.x > pushBy) scale.x = scale.x - pushBy;
          this.$emit("newBoxscale", { box: box.object, scale: scale });
          box.object.parent.position.setX(box.object.parent.position.x + pushBy);
          this.$emit("newBoxPosition", box.object);
        }
        // 4 5 , - y
        else if (box.faceIndex == 4 || box.faceIndex == 5) {
          if (scale.y > pushBy) scale.y = scale.y - pushBy;
          this.$emit("newBoxscale", { box: box.object, scale: scale });
        }
        // 6 7 , + y
        else if (box.faceIndex == 6 || box.faceIndex == 7) {
          if (scale.y > pushBy) scale.y = scale.y - pushBy;
          this.$emit("newBoxscale", { box: box.object, scale: scale });
          box.object.parent.position.setY(box.object.parent.position.y + pushBy);
          this.$emit("newBoxPosition", box.object);
        }
        // 8 9 , - z
        else if (box.faceIndex == 8 || box.faceIndex == 9) {
          if (scale.z > pushBy) scale.z = scale.z - pushBy;
          this.$emit("newBoxscale", { box: box.object, scale: scale });
        }
        // 10 11 , + z
        else if (box.faceIndex == 10 || box.faceIndex == 11) {
          if (scale.z > pushBy) scale.z = scale.z - pushBy;
          this.$emit("newBoxscale", { box: box.object, scale: scale });
          box.object.parent.position.setZ(box.object.parent.position.z + pushBy);
          this.$emit("newBoxPosition", box.object);
        }
      }
    },
  },
  mounted() {
    window.addEventListener("pointermove", (event) => {
      if (this.$refs.camera) {
        if (this.main_selected != 2) {
          pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
          pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

          raycaster.setFromCamera(pointer, this.$refs.camera.camera);

          allChilds = [];

          if (this.$refs.scene.scene.children.length > 0) {
            this.getAllChilds(this.$refs.scene.scene.children);
          }

          allChilds.forEach((element) => {
            if (element.type == "Mesh") {
              if (element.name != "") {
                if (this.projectData.main.pcr[element.name]) {
                  if (this.projectData.main.pcr[element.name].level == this.level_selected) {
                    element.material.color.set(0xa5df6e);
                    element.material.opacity = 0.4;
                  } else {
                    element.material.color.set(0xa3a5a1);
                    element.material.opacity = 0.1;
                  }
                }
              }
            }
          });

          const intersects = raycaster.intersectObjects(allChilds);
          const filterMesh = intersects.filter((element) => this.projectData.main.pcr[element.object.name]);
          const result = filterMesh.filter((element) => this.projectData.main.pcr[element.object.name].level == this.level_selected);
          if (result[0]) {
            result[0].object.material.color.set(0xd7da5a);
            result[0].object.material.opacity = 0.7;
          }
        } else {
          allChilds.forEach((element) => {
            if (element.type == "Mesh") {
              element.material.color.set(0xc5c5c2);
              element.material.opacity = 0.3;
            }
          });
        }
      }
    });
  },
};
</script>

<style>
.mainWindow {
  overflow: hidden;
  user-select: none;
  padding: 0;
  margin: 0;
}
.render-wrapper {
  height: 99%;
  width: 99%;
}
.three_detoggle {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 100px;
  height: 50px;
  background-color: #c5c5c2;
}
</style>
