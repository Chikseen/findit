<template>
  <Renderer antialias alpha :width="500" :height="500">
    <Camera :position="{ z: zoffset, x: xoffset, y: yoffset }" :aspect="1" :fov="100" :intensity="50" />
    <Raycaster
      @pointerEnter="onPointerEvent"
      @pointerOver="onPointerOver"
      @pointerMove="onPointerEvent"
      @pointerLeave="onPointerEvent"
      @click="onPointerEvent"
    />
    <Scene>
      <PointLight :position="{ y: 20, z: 100, x: 100 }" />
      <Frame :z_offset="0" />
      <Frame :z_offset="-100" />
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
  </Renderer>
</template>

<script>
import Frame from "./render/Frame.vue";

export default {
  components: {
    Frame,
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
  },
};
</script>
