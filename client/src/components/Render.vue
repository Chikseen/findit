<template>
  <div @click="click" id="mainWindow">
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

        <Group v-for="(item1, index1) in numberOfBoxesToRender" :key="index1" ref="firstStageGroup">
          <!-- Print Main BOX -->
          <BoxFrame ref="boxframe" :position="{ x: 100 * (item1 - 1), y: index1 * 10 }" />
          <!-- Print BOX -1 One -->
          <Group v-for="(item2, index2) in numberOfBoxesToRenderChild[index1]" :key="index2">
            <BoxFrame
              ref="boxframe"
              :position="{ x: 100 * (item1 - 1) + (100 / numberOfBoxesToRenderChild[index1]) * index2, y: index1 * 10 }"
              :scale="{ x: 1 / numberOfBoxesToRenderChild[index1], y: 1 / 1.5, z: 1 / 2 }"
            />
          </Group>
        </Group>

        <BoxFrame ref="boxframe" :position="{ x: -200, y: -200 }" />
      </Scene>
    </Renderer>
  </div>
</template>

<script>
import BoxFrame from "./render/BoxFrame.vue";
import { ref } from "vue";
import {
  Scene,
  TrackballControls,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  FogExp2,
  CylinderBufferGeometry,
  MeshPhongMaterial,
  Mesh,
  DirectionalLight,
  AmbientLight,
  LineBasicMaterial,
  Geometry,
  Vector3,
  Line,
  Raycaster,
  Vector2,
} from "three-full";
const rendererC = ref();
const meshC = ref();

let raycaster = new Raycaster();
let pointer = new Vector2();
let allChilds = [];

export default {
  components: {
    BoxFrame,
  },
  props: {
    numberOfBoxesToRender: { type: Number, default: 0 },
    numberOfBoxesToRenderChild: { type: Array, default: () => [] },
  },
  data() {
    return {
      yoffset: 0,
      xoffset: 0,
      zoffset: 1,
      yscale: 1,
      xscale: 1,
      zscale: 1,
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
    click(event) {
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
        if (box.faceIndex == 0 || box.faceIndex == 1) {
          box.object.parent.position.setX(box.object.parent.position.x - 100);
        }
        // 2 3 , + x
        if (box.faceIndex == 2 || box.faceIndex == 3) {
          box.object.parent.position.setX(box.object.parent.position.x + 100);
        }
        // 4 5 , - y
        if (box.faceIndex == 4 || box.faceIndex == 5) {
          box.object.parent.position.setY(box.object.parent.position.y - 100);
        }
        // 6 7 , + y
        if (box.faceIndex == 6 || box.faceIndex == 7) {
          box.object.parent.position.setY(box.object.parent.position.y + 100);
        }
        // 8 9 , - z
        if (box.faceIndex == 8 || box.faceIndex == 9) {
          box.object.parent.position.setZ(box.object.parent.position.z - 100);
        }
        // 10 11 , + z
        if (box.faceIndex == 10 || box.faceIndex == 11) {
          box.object.parent.position.setZ(box.object.parent.position.z + 100);
        }
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
    });
  },
};
</script>

<style>
.render-wrapper {
  height: 100%;
  width: 100%;
  border: 1px solid;
}
.three_detoggle {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 100px;
  height: 50px;
}
</style>
