<template>
  <Group>
    <PointLight :position="{ y: 20, z: 100, x: 100 }" />
    <Frame />
    <Frame :position="{ z: 100 }" />
      <!-- Upper Left Bar -->
      <Box :position="{ x: 0, y: 100, z: 50 }" :scale="{ x: 1, y: 1, z: 101 }">
        <LambertMaterial />
      </Box>

      <!-- Upper Right Bar -->
      <Box :position="{ x: 100, y: 100, z: 50 }" :scale="{ x: 1, y: 1, z: 101 }">
        <LambertMaterial />
      </Box>

      <!-- Lower Right Bar -->
      <Box :position="{ x: 100, y: 0, z: 50 }" :scale="{ x: 1, y: 1, z: 101 }">
        <LambertMaterial />
      </Box>

      <!-- Lower Left Bar -->
      <Box :position="{ x: 0, y: 0, z: 50 }" :scale="{ x: 1, y: 1, z: 101 }">
        <LambertMaterial />
      </Box>
  </Group>
</template>

<script>
import Frame from "./Frame.vue";

export default {
  components: {
    Frame,
  },
  data() {
    return {};
  },
  props: {
    z_offset: { type: Number, default: 0 },
  },
};
</script>
