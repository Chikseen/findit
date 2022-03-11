<template>
  <Group>
    <!-- Rigth Ver -->
    <Box :position="{ x: 100, y: 50, z: 0 }" :scale="{ x: 1, y: 100, z: 1 }">
      <LambertMaterial />
    </Box>

    <!-- Left Ver -->
    <Box :position="{ x: 0, y: 50, z: 0 }" :scale="{ x: 1, y: 100, z: 1 }">
      <LambertMaterial />
    </Box>

    <!-- Rigth Hor -->
    <Box :position="{ x: 50, y: 100, z: 0 }" :scale="{ x: 100, y: 1, z: 1 }">
      <LambertMaterial />
    </Box>

    <!-- Left Hor -->
    <Box :position="{ x: 50, y: 0, z: 0 }" :scale="{ x: 100, y: 1, z: 1 }">
      <LambertMaterial />
    </Box>
  </Group>
</template>
