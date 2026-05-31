<template>
  <div class="dodecahedron-viewer">
    <TresCanvas
      :camera="{ position: [0, 0, 5], fov: 45 }"
      class="canvas"
    >
      <OrbitControls :enable-damping="true" />
      <ambient-light :intensity="0.5" />
      <directional-light
        :position="[-2, 2, 2]"
        :intensity="1"
      />
      <mesh :geometry="geometry" :material="material" />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { TresCanvas, OrbitControls } from '@tresjs/core';
import { 
  SphereGeometry, 
  MeshStandardMaterial, 
  Mesh
} from 'three';

const geometry = ref();
const material = ref();

onMounted(() => {
  geometry.value = new SphereGeometry(1, 32, 32);
  material.value = new MeshStandardMaterial({ 
    color: 0x00aaff,
    wireframe: true
  });
});
</script>

<style scoped>
.dodecahedron-viewer {
  width: 100%;
  height: 100%;
  position: relative;
}

.canvas {
  width: 100%;
  height: 100%;
}
</style>
