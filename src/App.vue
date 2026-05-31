<template>
  <div class="app">
    <header>
      <h1>Dodecahedron Stellations</h1>
    </header>
    <div class="content">
      <DodecahedronViewer />
      <StellationSlider @stellation-change="onStellationChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import DodecahedronViewer from './components/DodecahedronViewer.vue';
import StellationSlider from './components/StellationSlider.vue';

const currentStellation = ref(0);

const onStellationChange = (value: number) => {
  currentStellation.value = value;
  // Update 3D model based on stellation value
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #111;
  color: white;
  overflow: hidden;
}

.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  padding: 20px;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
}
</style>
