<template>
  <Group>
    <!-- Rigth Ver -->
    <Box :position="{ x: 100, y: 0, z: z_offset }" :scale="{ x: 10, y: 200, z: 5 }">
      <LambertMaterial />
    </Box>

    <!-- Left Ver -->
    <Box :position="{ x: -100, y: 0, z: z_offset }" :scale="{ x: 10, y: 200, z: 5 }">
      <LambertMaterial />
    </Box>

    <!-- Rigth Hor -->
    <Box :position="{ x: 0, y: 100, z: z_offset }" :scale="{ x: 200, y: 10, z: 5 }">
      <LambertMaterial />
    </Box>

    <!-- Left Hor -->
    <Box :position="{ x: 0, y: -100, z: z_offset }" :scale="{ x: 200, y: 10, z: 5 }">
      <LambertMaterial />
    </Box>
  </Group>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    z_offset: { type: Number, default: 0 },
  },
};
</script>
