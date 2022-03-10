<template>
  <Renderer ref="renderer" antialias alpha class="render-wrapper" resize="window" orbit-ctrl>
    <Camera ref="camera" :position="{ z: 150, x: 0, y: 0 }" :fov="100" />
    <Raycaster />
    <Scene>
      <PointLight :position="{ y: 20, z: 100, x: 100 }" :intensity="0" />
      <AmbientLight color="#aaaaaa" :intensity="0.1" />
      <Sphere :position="{ x: 0, y: 0, z: 0 }" :radius="5">
        <LambertMaterial />
      </Sphere>
      <BoxFrame ref="boxframe" :z_offset="0" :position="{ z: zoffset, x: xoffset, y: yoffset }" :scale="{ z: zscale, x: xscale, y: yscale }" />
    </Scene>
    <div>
      <h1>Position</h1>
      <div>
        <label for="yoffset">Y-Offset</label>
        <input type="range" id="yoffset" min="0" max="100" v-model="yoffset" />
        <label for="yoffset"></label>
      </div>
      <div>
        <label for="xoffset">X-Offset</label>
        <input type="range" id="xoffset" min="0" max="100" v-model="xoffset" />
        <label for="xoffset"></label>
      </div>
      <div>
        <label for="zoffset">Z-Offset</label>
        <input type="range" id="zoffset" min="0" max="200" v-model="zoffset" />
        <label for="zoffset"></label>
      </div>
      <div>
        <button>Rotate camera to the left</button>
        <button @mouseup="getcurrentdata">getData</button>
      </div>
    </div>
    <div>
      <h1>Scale</h1>
      <div>
        <label for="yscale">Y-scale</label>
        <input type="range" id="yoffset" min="0" max="5" step="0.01" v-model="yscale" />
        <label for="yscale"></label>
      </div>
      <div>
        <label for="xoffset">X-scale</label>
        <input type="range" id="xoffset" min="0" max="5" step="0.01" v-model="xscale" />
        <label for="xoffset"></label>
      </div>
      <div>
        <label for="zscale">Z-Offset</label>
        <input type="range" id="zscale" min="0" max="5" step="0.01" v-model="zscale" />
        <label for="zscale"></label>
      </div>
    </div>
  </Renderer>
</template>

<script>
import BoxFrame from "./render/BoxFrame.vue";

export default {
  components: {
    BoxFrame,
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
  },
  mounted() {},
};
</script>

<style>
.render-wrapper {
  width: 50%;
  border: 1px solid;
}
</style>
