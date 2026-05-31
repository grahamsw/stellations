<template>
  <div class="slider-container">
    <div class="slider-labels">
      <span>Base</span>
      <span>First Stellation</span>
      <span>Second Stellation</span>
    </div>
    <input
      type="range"
      min="0"
      max="2"
      step="0.01"
      :value="currentStellation"
      @input="onSliderChange"
      class="stellation-slider"
    />
    <div class="current-stellation">
      Current: {{ stellationNames[currentStellation] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const stellationNames = ['Base', 'First Stellation', 'Second Stellation'];
const currentStellation = ref(0);

const emit = defineEmits(['stellation-change']);

const onSliderChange = (event: Event) => {
  const value = parseFloat((event.target as HTMLInputElement).value);
  currentStellation.value = value;
  emit('stellation-change', value);
};
</script>

<style scoped>
.slider-container {
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 10px;
  color: white;
  margin-top: 20px;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.stellation-slider {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #444;
  outline: none;
  -webkit-appearance: none;
}

.stellation-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #00aaff;
  cursor: pointer;
}

.current-stellation {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}
</style>
