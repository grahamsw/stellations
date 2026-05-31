<template>
  <div class="app-container">
    <!-- Premium Cybernetic Floating Header -->
    <header class="studio-header animate-fade-in">
      <h1 class="glow-title">Stellar Polyhedra</h1>
      <div class="solid-selector-wrapper">
        <label for="solid-select" class="selector-label">Polyhedron:</label>
        <div class="custom-select-wrapper">
          <select id="solid-select" v-model="currentSolid" @change="onSolidChange" class="solid-select">
            <option value="dodecahedron">Dodecahedron</option>
            <option value="icosahedron">Icosahedron</option>
          </select>
          <span class="select-arrow"></span>
        </div>
      </div>
    </header>
    
    <!-- Material Studio Sidebar toggle button -->
    <button class="btn-studio-toggle animate-fade-in" @click="isStudioOpen = !isStudioOpen" :class="{ open: isStudioOpen }">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <span>{{ isStudioOpen ? 'Close Panel' : 'Customize Materials' }}</span>
    </button>

    <!-- 3D Canvas + Control Dock container -->
    <div class="viewport-container">
      <PolyhedronViewer :stellation="currentStellation" :solid-type="currentSolid" :config="materialConfig" />
      <StellationSlider :stellation="currentStellation" :solid-type="currentSolid" @stellation-change="onStellationChange" />
    </div>

    <!-- Collapsible Futuristic Material Studio Sidebar -->
    <div class="material-studio-sidebar" :class="{ open: isStudioOpen }">
      <div class="sidebar-header">
        <h2>Material Studio</h2>
        <p class="studio-info">Independently customize colors and the target opacities of both outer and nested inner layers for each stellation phase.</p>
      </div>

      <div class="sidebar-body">
        <!-- Static Override Toggle -->
        <div class="override-box">
          <label class="toggle-container">
            <input type="checkbox" v-model="materialConfig.overrideScaling" />
            <span class="checkmark"></span>
            <span class="toggle-label">Static Value Override</span>
          </label>
          <p class="override-info">
            <strong>Active:</strong> Forces exact opacities in real time.<br />
            <strong>Inactive:</strong> Blends smoothly between target values during transitions.
          </p>
        </div>

        <!-- Color Settings -->
        <div class="studio-section">
          <h3>Color Customization</h3>
          <div class="control-row">
            <label>Core Face Color</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="materialConfig.coreColor" />
              <span class="color-hex">{{ materialConfig.coreColor }}</span>
            </div>
          </div>
          <div class="control-row">
            <label>1st Stellation Face Color</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="materialConfig.firstColor" />
              <span class="color-hex">{{ materialConfig.firstColor }}</span>
            </div>
          </div>
          <div class="control-row">
            <label>2nd Stellation Face Color</label>
            <div class="color-picker-wrapper">
              <input type="color" v-model="materialConfig.secondColor" />
              <span class="color-hex">{{ materialConfig.secondColor }}</span>
            </div>
          </div>
        </div>

        <!-- Phase 0: Base Case Target Opacities -->
        <div class="studio-section">
          <div class="section-title-row">
            <span class="bullet cyan-bullet"></span>
            <h3>{{ currentSolid === 'icosahedron' ? 'Phase 0: Base Icosahedron' : 'Phase 0: Base Dodecahedron' }}</h3>
          </div>
          <div class="control-row">
            <label>Core Face Opacity: <span class="val">{{ Math.round(materialConfig.coreOpacity0 * 100) }}%</span></label>
            <input type="range" min="0" max="1" step="0.05" v-model.number="materialConfig.coreOpacity0" />
          </div>
          <div class="control-row">
            <label>Core Edge Opacity: <span class="val">{{ Math.round(materialConfig.coreEdgeOpacity0 * 100) }}%</span></label>
            <input type="range" min="0" max="1" step="0.05" v-model.number="materialConfig.coreEdgeOpacity0" />
          </div>
        </div>

        <!-- Phase 1: 1st Stellation Target Opacities -->
        <div class="studio-section">
          <div class="section-title-row">
            <span class="bullet magenta-bullet"></span>
            <h3>{{ currentSolid === 'icosahedron' ? 'Phase 1: Small Triambic Icosahedron' : 'Phase 1: Small Stellated Dodecahedron' }}</h3>
          </div>
          <div class="control-row">
            <label>Star/Pyramid Points Opacity: <span class="val">{{ Math.round(materialConfig.firstOpacity1 * 100) }}%</span></label>
            <input type="range" min="0" max="1" step="0.05" v-model.number="materialConfig.firstOpacity1" />
          </div>
          <div class="control-row">
            <label>Enclosed Core Opacity: <span class="val">{{ Math.round(materialConfig.coreOpacity1 * 100) }}%</span></label>
            <input type="range" min="0" max="1" step="0.05" v-model.number="materialConfig.coreOpacity1" />
          </div>
          <div class="control-row">
            <label>Star Edges Opacity: <span class="val">{{ Math.round(materialConfig.firstEdgeOpacity1 * 100) }}%</span></label>
            <input type="range" min="0" max="1" step="0.05" v-model.number="materialConfig.firstEdgeOpacity1" />
          </div>
        </div>

        <!-- Phase 2: 2nd Stellation Target Opacities -->
        <div class="studio-section">
          <div class="section-title-row">
            <span class="bullet gold-bullet"></span>
            <h3>{{ currentSolid === 'icosahedron' ? 'Phase 2: Great Icosahedron' : 'Phase 2: Great Dodecahedron' }}</h3>
          </div>
          <div class="control-row">
            <label>Valley/Great Faces Opacity: <span class="val">{{ Math.round(materialConfig.secondOpacity2 * 100) }}%</span></label>
            <input type="range" min="0" max="1" step="0.05" v-model.number="materialConfig.secondOpacity2" />
          </div>
          <div class="control-row">
            <label>Enclosed 1st Stell. Opacity: <span class="val">{{ Math.round(materialConfig.firstOpacity2 * 100) }}%</span></label>
            <input type="range" min="0" max="1" step="0.05" v-model.number="materialConfig.firstOpacity2" />
          </div>
          <div class="control-row">
            <label>Enclosed Core Opacity: <span class="val">{{ Math.round(materialConfig.coreOpacity2 * 100) }}%</span></label>
            <input type="range" min="0" max="1" step="0.05" v-model.number="materialConfig.coreOpacity2" />
          </div>
          <div class="control-row">
            <label>Valley Edges Opacity: <span class="val">{{ Math.round(materialConfig.secondEdgeOpacity2 * 100) }}%</span></label>
            <input type="range" min="0" max="1" step="0.05" v-model.number="materialConfig.secondEdgeOpacity2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Space Background & Glow Orbs -->
    <div class="space-background">
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PolyhedronViewer from './components/PolyhedronViewer.vue';
import StellationSlider from './components/StellationSlider.vue';

// The main reactive stellation state, ranging from 0.0 to 2.0
const currentStellation = ref(0);

const onStellationChange = (value: number) => {
  currentStellation.value = value;
};

// Selected active solid shape
const currentSolid = ref<'dodecahedron' | 'icosahedron'>('dodecahedron');

const onSolidChange = () => {
  currentStellation.value = 0; // reset stellation upon solid switch
};

// Collapsible sidebar state
const isStudioOpen = ref(false);

// Reactive Material Studio configuration
// Exposes exact controls to independently set nested opacities for each of the stellation phases.
const materialConfig = ref({
  overrideScaling: false,
  coreColor: '#00ffff',
  firstColor: '#ff007f',
  secondColor: '#ffd700',
  
  // Phase 0: Base
  coreOpacity0: 0.75,
  coreEdgeOpacity0: 0.15, // Subtle cyan edge outline
  
  // Phase 1: 1st Stellation
  firstOpacity1: 0.75,
  coreOpacity1: 0.85, // Inner dodecahedron opacity during small stellation
  firstEdgeOpacity1: 0.15, // Subtle magenta edge outline
  
  // Phase 2: 2nd Stellation
  secondOpacity2: 0.75,
  firstOpacity2: 0.85, // 1st stellation opacity during great stellation
  coreOpacity2: 1.0, // Inner dodecahedron opacity during great stellation
  secondEdgeOpacity2: 0.15, // Extremely subtle enclosing edge lines
});
</script>

<style>
/* CSS Resets & Font imports */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #030307 !important;
  color: #ffffff;
  font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
  width: 100vw;
  height: 100vh;
}

/* App container */
.app-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Premium Floating Header */
.studio-header {
  position: absolute;
  top: 24px;
  left: 32px;
  z-index: 10;
  pointer-events: none;
  background: rgba(13, 13, 23, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 12px 24px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
}

.glow-title {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: linear-gradient(90deg, #00ffff, #ff00ff, #ffd700);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shine 4s linear infinite;
  margin-bottom: 2px;
}

.subtitle {
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.5px;
}

/* Customize Materials Sidebar toggle button */
.btn-studio-toggle {
  position: absolute;
  top: 24px;
  right: 32px;
  z-index: 12;
  background: rgba(13, 13, 23, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.85);
  padding: 10px 18px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.btn-studio-toggle:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
}

.btn-studio-toggle.open {
  background: #ff007f;
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 20px rgba(255, 0, 127, 0.35);
}

/* Viewport and Canvas Container */
.viewport-container {
  position: relative;
  flex: 1;
  width: 100vw;
  height: 100vh;
  display: block;
}

/* Futuristic Collapsible Material Studio Sidebar */
.material-studio-sidebar {
  position: absolute;
  top: 90px;
  right: 32px;
  width: 320px;
  max-height: calc(100vh - 120px);
  z-index: 11;
  background: rgba(13, 13, 23, 0.7);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55), 
              inset 0 1px 1px rgba(255, 255, 255, 0.08);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  transform: translateX(380px);
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.material-studio-sidebar.open {
  transform: translateX(0);
  opacity: 1;
  pointer-events: all;
}

.sidebar-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #00ffff, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
}

.studio-info {
  font-size: 0.78rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.5);
}

/* Override Box styling */
.override-box {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toggle-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  gap: 10px;
}

.toggle-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: relative;
  height: 18px;
  width: 36px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 9px;
  transition: background-color 0.2s ease;
}

.checkmark:after {
  content: "";
  position: absolute;
  left: 2px;
  top: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #fff;
  transition: transform 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

.toggle-container input:checked ~ .checkmark {
  background-color: #ff007f;
}

.toggle-container input:checked ~ .checkmark:after {
  transform: translateX(18px);
}

.toggle-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
}

.override-info {
  font-size: 0.72rem;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.4);
}

/* Studio Section & Sliders */
.studio-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bullet {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 6px currentColor;
}

.cyan-bullet { color: #00ffff; background: #00ffff; }
.magenta-bullet { color: #ff007f; background: #ff007f; }
.gold-bullet { color: #ffd700; background: #ffd700; }

.studio-section h3 {
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.9);
}

.control-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-row label {
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: space-between;
}

.control-row label .val {
  font-family: 'Courier New', monospace;
  color: #fff;
  font-weight: 700;
}

.control-row input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  outline: none;
  cursor: pointer;
}

.control-row input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  transition: transform 0.1s ease;
}

.control-row input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

/* Color Picker wrapping styling */
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 4px 8px;
}

.color-picker-wrapper input[type="color"] {
  -webkit-appearance: none;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: none;
  cursor: pointer;
}

.color-picker-wrapper input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker-wrapper input[type="color"]::-webkit-color-swatch {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}

.color-hex {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
}

/* Ambient space background styling */
.space-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at center, #0f0c1b 0%, #030307 100%);
  z-index: -2;
  overflow: hidden;
}

/* Ambient glowing cosmic orbs */
.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(140px);
  opacity: 0.12;
  z-index: -1;
  pointer-events: none;
}

.orb-1 {
  top: 15%;
  left: 20%;
  width: 350px;
  height: 350px;
  background: #00ffff;
  animation: float-slow 20s infinite alternate;
}

.orb-2 {
  bottom: 20%;
  right: 15%;
  width: 400px;
  height: 400px;
  background: #ff007f;
  animation: float-slow 25s infinite alternate-reverse;
}

/* Keyframes */
@keyframes shine {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

@keyframes float-slow {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, 30px) scale(1.15); }
}

.animate-fade-in {
  animation: fadeIn 1s cubic-bezier(0.19, 1, 0.22, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .studio-header {
    width: calc(100% - 64px - 140px);
    left: 16px;
    top: 16px;
    padding: 8px 16px;
  }
  .glow-title {
    font-size: 1.2rem;
    letter-spacing: 1px;
  }
  .selector-label {
    font-size: 0.7rem;
  }
  .solid-select {
    padding: 4px 24px 4px 8px;
    font-size: 0.78rem;
  }
  .btn-studio-toggle {
    top: 16px;
    right: 16px;
    padding: 8px 12px;
    font-size: 0.78rem;
  }
  .btn-studio-toggle span {
    display: none; /* Hide text on mobile */
  }
  .material-studio-sidebar {
    width: calc(100% - 32px);
    right: 16px;
    top: 80px;
    max-height: calc(100vh - 110px);
  }
}

/* Glassmorphic Solid Selector in Header */
.solid-selector-wrapper {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  pointer-events: auto;
}

.selector-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.5);
}

.custom-select-wrapper {
  position: relative;
  display: inline-block;
}

.solid-select {
  appearance: none;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  padding: 6px 32px 6px 12px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.solid-select:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.solid-select:focus {
  border-color: #ff007f;
  box-shadow: 0 0 10px rgba(255, 0, 127, 0.25);
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid rgba(255, 255, 255, 0.6);
  pointer-events: none;
}

.solid-select:hover ~ .select-arrow {
  border-top-color: #ffffff;
}
</style>
