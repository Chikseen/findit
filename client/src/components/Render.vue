<template>
  <Renderer ref="renderer" antialias alpha class="render-wrapper" resize="window" orbit-ctrl>
    <Camera ref="camera" :position="{ z: 150, x: 0, y: 0 }" :fov="100" />
    <Raycaster />
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
      <button @mouseup="rotateRight">Rotate camera to the rigth</button>
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
  methods: {},
  mounted() {},
};
</script>

<style>
.render-wrapper {
  width: 50%;
  border: 1px solid;
}
</style>
