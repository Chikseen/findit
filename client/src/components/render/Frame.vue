<template>
  <div>
    <!-- Rigth Ver -->
    <Box :position="{ x: frameScale.x, y: frameScale.y / 2, z: zOffset }" :scale="{ x: 1, y: frameScale.y, z: 1 }">
      <LambertMaterial />
    </Box>

    <!-- Left Ver -->
    <Box :position="{ x: 0, y: frameScale.y / 2, z: zOffset }" :scale="{ x: 1, y: frameScale.y, z: 1 }">
      <LambertMaterial />
    </Box>

    <!-- Upper Hor -->
    <Box :position="{ x: frameScale.x / 2, y: frameScale.y, z: zOffset }" :scale="{ x: frameScale.x, y: 1, z: 1 }">
      <LambertMaterial />
    </Box>

    <!-- Lower Hor -->
    <Box :position="{ x: frameScale.x / 2, y: 0, z: zOffset }" :scale="{ x: frameScale.x, y: 1, z: 1 }">
      <LambertMaterial />
    </Box>
  </div>
</template>

<script>
export default {
  props: {
    frameScale: { type: Object, default: { x: 100, y: 100, z: 100 } },
    zOffset: { type: Number, default: 0 },
  },
};
</script>
