<template>
  <div class="dodecahedron-viewer">
    <TresCanvas window-size>
      <ambient-light :intensity="1.5" />
      <directional-light :position="[5, 5, 5]" :intensity="2" />
      <!-- Fallback placeholder object to verify WebGL is working -->
      <mesh>
        <boxGeometry :args="[1, 1, 1]" />
        <meshNormalMaterial />
      </mesh>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core';
</script>

<style scoped>
.dodecahedron-viewer {
  width: 100vw;
  height: 100vh;
  display: block;
  position: relative;
}

.canvas {
  width: 100%;
  height: 100%;
}
</style>
