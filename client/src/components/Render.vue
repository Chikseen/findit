<template>
  <renderer :size="{ w: 600, h: 400 }">
    <scene>
      <camera :position="{ z: 15 }"></camera>
      <mesh :obj="mesh" :position="{ y: -200 }"></mesh>
      <animation :fn="animate" :speed="3"></animation>
    </scene>
  </renderer>
</template>
