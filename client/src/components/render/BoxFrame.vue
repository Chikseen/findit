<template>
  <Group>
    <Frame :frameScale="{ x: boxScale.x, y: boxScale.y, z: boxScale.z }" />
    <Frame :frameScale="{ x: boxScale.x, y: boxScale.y, z: boxScale.z }" :zOffset="boxScale.z" />

    <!--     <Sphere :position="{ x: 0, y: 0, z: 0 }" :radius="5">
      <LambertMaterial />
    </Sphere> -->

    <!-- Upper Left Bar -->
    <Box :position="{ x: 0, y: boxScale.y, z: boxScale.z / 2 }" :scale="{ x: 1, y: 1, z: boxScale.z }">
      <LambertMaterial />
    </Box>

    <!-- Upper Right Bar -->
    <Box :position="{ x: boxScale.x, y: boxScale.y, z: boxScale.z / 2 }" :scale="{ x: 1, y: 1, z: boxScale.z }">
      <LambertMaterial />
    </Box>

    <!-- Lower Right Bar -->
    <Box :position="{ x: boxScale.x, y: 0, z: boxScale.z / 2 }" :scale="{ x: 1, y: 1, z: boxScale.z }">
      <LambertMaterial />
    </Box>

    <!-- Lower Left Bar -->
    <Box :position="{ x: 0, y: 0, z: boxScale.z / 2 }" :scale="{ x: 1, y: 1, z: boxScale.z }">
      <LambertMaterial />
    </Box>

    <Box :position="{ x: boxScale.x / 2, y: boxScale.y / 2, z: boxScale.z / 2 }" :scale="boxScale" :props="{ name: setName }" :ref="setName">
      <LambertMaterial color="#454545" :props="{ transparent: true, opacity: 0.2 }" />
    </Box>

    <div v-if="projectData[setName].childs.length > 0">
      <div v-for="child in projectData[setName].childs" :key="child">
        <BoxFrame
          ref="boxframe"
          :projectData="projectData"
          :modifier="projectData[setName].level"
          :position="projectData[child].position"
          :boxScale="projectData[child].scale"
          :setName="child"
          :text="'HELLO'"
        />
      </div>
    </div>
  </Group>
</template>

<script>
import Frame from "./Frame.vue";
import { Text } from "troika-three-text";

export default {
  components: {
    Frame,
  },
  props: {
    projectData: { type: Object, default: () => {} },
    setName: { type: String, default: "" },
    text: { type: String, default: "" },
    boxScale: { type: Object, default: { x: 100 , y: 100, z: 100 } },
  },
  mounted() {
    const text = new Text();
    this.$refs[this.setName].mesh.add(text);
    text.text = this.setName;
    text.fontSize = 0.1;
    text.anchorX = "50%";
    text.depthOffset = -9999;
    text.color = 0x9966ff;

    // Update the rendering:
    text.sync();
  },
};
</script>
