<template>
  <Renderer ref="rendererC" antialias alpha class="render-wrapper" resize="window" orbit-ctrl>
    <Camera ref="camera" :position="{ z: 150, x: 0, y: 0 }" :fov="100" />
    <Raycaster />
    <Scene>
      <PointLight :position="{ y: 20, z: 100, x: 100 }" :intensity="0" />
      <PointLight :position="{ y: 20, z: 100, x: 100 }" />
      <AmbientLight color="#aaaaaa" :intensity="0.1" />

      <Sphere :position="{ x: 0, y: 0, z: 0 }" :radius="5">
        <LambertMaterial />
      </Sphere>

      <Group v-for="(item1, index1) in numberOfBoxesToRender" :key="index1">
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

      <!--  <BoxFrame ref="boxframe" :z_offset="0" :position="{ z: zoffset, x: xoffset, y: yoffset }" :scale="{ z: zscale / 2, x: xscale / 2, y: yscale / 2 }" />
      <BoxFrame
        ref="boxframe"
        :z_offset="0"
        :position="{ z: zoffset + 50 * zscale, x: xoffset + 50 * xscale, y: yoffset + 50 * yscale }"
        :scale="{ z: zscale / 2, x: xscale / 2, y: yscale / 2 }"
      /> -->
    </Scene>
  </Renderer>
</template>

<script>
/*

import { ref, onMounted } from 'vue'
import { Box, Camera, LambertMaterial, PointLight, Renderer, Scene } from 'troisjs'
const rendererC = ref()
const meshC = ref()
onMounted(() => {
  const mesh = meshC.value.mesh
  renderer.onBeforeRender(() => {
    mesh.rotation.x += 0.01
  })
})

*/
import BoxFrame from "./render/BoxFrame.vue";
import { ref } from "vue";
const rendererC = ref();
const meshC = ref();

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
  },
};
</script>

<style>
.render-wrapper {
  width: 50%;
  border: 1px solid;
}
</style>
