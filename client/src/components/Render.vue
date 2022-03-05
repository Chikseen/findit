<template>
  <Renderer ref="renderer" antialias alpha class="render-wrapper" resize="window / 2" orbit-ctrl>
    <Camera ref="camera" :position="{ z: 150, x: 0, y: 0 }" :fov="100" />
    <Raycaster
      @pointerEnter="onPointerEvent"
      @pointerOver="onPointerOver"
      @pointerMove="onPointerEvent"
      @pointerLeave="onPointerEvent"
      @click="onPointerEvent"
    />
    <Scene>
      <PointLight :position="{ y: 20, z: 100, x: 100 }" :intensity="0" />
      <AmbientLight color="#ffffff" :intensity="0.1" />
      <Box :z_offset="0" :position="{ z: zoffset, x: xoffset, y: yoffset }" />
    </Scene>
    <div>
      <label for="yoffset">Y-Offset</label>
      <input type="range" id="yoffset" min="-100" max="100" v-model="yoffset" />
      <label for="yoffset"></label>
    </div>
    <div>
      <label for="xoffset">X-Offset</label>
      <input type="range" id="xoffset" min="-100" max="100" v-model="xoffset" />
      <label for="xoffset"></label>
    </div>
    <div>
      <label for="zoffset">Z-Offset</label>
      <input type="range" id="zoffset" min="0" max="200" v-model="zoffset" />
      <label for="zoffset"></label>
    </div>
    <div>
      <button>Rotate camera to the left</button>
      <button @click="rotateRight">Rotate camera to the rigth</button>
    </div>
  </Renderer>
</template>

<script>
import Box from "./render/Box.vue";

export default {
  components: {
    Box,
  },
  data() {
    return {
      yoffset: 0,
      xoffset: 0,
      zoffset: 100,
    };
  },
  methods: {
    onPointerEvent(event) {
      console.log(event);
    },
    onPointerOver(event) {
      event.component.mesh.material.color.set(event.over ? 0xff0000 : 0xffffff);
    },
    rotateRight() {
      camera.rotation.y = (camera.rotation.y * Math.PI) / 180;
    },
  },
  mounted() {
    const camera = this.$refs.camera.camera;
    console.log("camera", camera);

  
  },
};
</script>

<style>
/*   .render-wrapper {
    width: 75%;
    height: 500px;
  } */
</style>
