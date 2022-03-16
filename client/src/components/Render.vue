<template>
  <div @mousedown="saveMouseDown" @mouseup="click" id="mainWindow">
    <button class="three_detoggle" @click="$emit('detoogle')">DETOGGLE</button>
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
              <BoxFrame ref="boxframe" :position="projectData.main.pcr[item].position" :setName="item" />
            </div>
            <div v-else>
              <BoxFrame ref="boxframe" :position="{ x: 100 * index }" :setName="item" :text="'HELLO'"/>
            </div>
            <!-- Print BOX -1 One -->
            <!-- NO NEED YET -->
            <!--   <Group v-for="(item2, index2) in numberOfBoxesToRenderChild[index1]" :key="index2">
            <BoxFrame
              ref="boxframe"
              :position="{ x: 100 * (item1 - 1) + (100 / numberOfBoxesToRenderChild[index1]) * index2, y: index1 * 10 }"
              :scale="{ x: 1 / numberOfBoxesToRenderChild[index1], y: 1 / 1.5, z: 1 / 2 }"
            />
          </Group> -->
          </Group>
        </div>
      </Scene>
    </Renderer>
  </div>
</template>

<script>
import BoxFrame from "./render/BoxFrame.vue";
import {
  Raycaster,
  Vector2,
} from "three-full";

let raycaster = new Raycaster();
let pointer = new Vector2();
let allChilds = [];


export default {
  components: {
    BoxFrame,
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

        if (intersects[0]) {
          console.log(intersects[0]);

          const box = intersects[0];
          console.log("box.faceIndex", box.faceIndex);

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
          } else {
            console.log("sometginh went wrong in the box replacement proccess");
          }
        }
      } else {
        console.log("mouse movment dont move block");
      }
    },
  },
  mounted() {
    window.addEventListener("pointermove", (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, this.$refs.camera.camera);

      allChilds = [];

      if (this.$refs.scene.scene.children.length > 0) {
        this.getAllChilds(this.$refs.scene.scene.children);
      }

      allChilds.forEach((element) => {
        if (element.type == "Mesh") {
          element.material.color.set(0xffaaff);
        }
      });

      const intersects = raycaster.intersectObjects(allChilds);

      if (intersects[0]) intersects[0].object.material.color.set(0xff0000);

      /*


        var options = {
  size: 90,
  height: 90,
  weight: 'normal',
  font: 'helvetiker',
  style: 'normal',
  bevelThickness: 2,
  bevelSize: 4,
  bevelSegments: 3,
  bevelEnabled: true,
  curveSegments: 12,
  steps: 1
};

// the createMesh is the same function we saw earlier
text1 = createMesh(new THREE.TextGeometry("Learning", options));
text1.position.z = -100;
text1.position.y = 100...



        */
    });
  },
};
</script>

<style>
.render-wrapper {
  height: 100%;
  width: 100%;
}
.three_detoggle {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 100px;
  height: 50px;
}
</style>
