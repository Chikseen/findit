<template>
  <Group>
    <PointLight :position="{ y: 20, z: 100, x: 100 }" />
    <Frame :z_offset="z_offset - 0" />
    <Frame :z_offset="z_offset - 100" />

    <!-- Upper Left Bar -->
    <Box :position="{ x: -100, y: 100, z: z_offset - 50 }" :scale="{ x: 10, y: 10, z: 105 }">
      <LambertMaterial />
    </Box>

    <!-- Upper Right Bar -->
    <Box :position="{ x: 100, y: 100, z: z_offset - 50 }" :scale="{ x: 10, y: 10, z: 105 }">
      <LambertMaterial />
    </Box>

    <!-- Lower Right Bar -->
    <Box :position="{ x: 100, y: -100, z: z_offset - 50 }" :scale="{ x: 10, y: 10, z: 105 }">
      <LambertMaterial />
    </Box>

    <!-- Lower Left Bar -->
    <Box :position="{ x: -100, y: -100, z: z_offset - 50 }" :scale="{ x: 10, y: 10, z: 105 }">
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
