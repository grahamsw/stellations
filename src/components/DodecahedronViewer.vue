<template>
  <div class="dodecahedron-viewer">
    <TresCanvas window-size>
      <OrbitControls />
      <AmbientLight :intensity="1.5" />
      <DirectionalLight :position="[5, 5, 5]" :intensity="2" />
      <mesh :geometry="geometry" :material="material" />
      <!-- Fallback placeholder object to verify WebGL is working -->
      <mesh>
        <boxGeometry :args="[1, 1, 1]" />
        <meshNormalMaterial />
      </mesh>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TresCanvas, OrbitControls, AmbientLight, DirectionalLight } from '@tresjs/core';
import { 
  BoxGeometry, 
  MeshStandardMaterial, 
  Mesh,
  BoxGeometry as ThreeBoxGeometry
} from 'three';

const geometry = ref();
const material = ref();

onMounted(() => {
  // Create a simple box geometry as fallback
  geometry.value = new ThreeBoxGeometry(1, 1, 1);
  material.value = new MeshStandardMaterial({ 
    color: 0x00aaff,
    wireframe: true
  });
});
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
