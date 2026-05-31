<template>
  <div class="control-panel" :class="{ collapsed: isCollapsed }">
    <!-- Collapse Toggle Button (Mobile Only) -->
    <button class="btn-collapse-toggle" @click="isCollapsed = !isCollapsed" :title="isCollapsed ? 'Expand Panel' : 'Collapse Panel'">
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" class="chevron-icon">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
    <!-- Mathematical Phase Description Header -->
    <div class="description-box">
      <h3 class="phase-title">{{ phaseTitle }}</h3>
      <p class="phase-desc">{{ phaseDescription }}</p>
    </div>

    <!-- Main Controller Area: Side-by-side Vertical Slider and Stacked Buttons -->
    <div class="controller-body">
      <!-- Left Column: Beautiful Vertical Slider -->
      <div class="slider-column">
        <span class="value-display">0.0</span>
        <div class="slider-wrapper">
          <input
            type="range"
            min="0"
            max="2"
            step="0.005"
            :value="stellation"
            @input="onSliderChange"
            class="stellation-slider"
          />
          <div class="slider-fill" :style="{ '--percent': `${(stellation / 2) * 100}%` }"></div>
        </div>
        <span class="value-display">2.0</span>
      </div>

      <!-- Right Column: Navigation and Playback Buttons -->
      <div class="buttons-column">
        <!-- Fast Jump Buttons (Vertical stack) -->
        <div class="jump-group-vertical">
          <button 
            @click="jumpTo(0.0)" 
            class="btn-secondary" 
            :class="{ active: stellation === 0.0 }"
            :title="solidType === 'icosahedron' ? 'Base Icosahedron' : 'Base Dodecahedron'"
          >
            Base
          </button>
          <button 
            @click="jumpTo(1.0)" 
            class="btn-secondary" 
            :class="{ active: stellation === 1.0 }"
            :title="solidType === 'icosahedron' ? 'Small Triambic Icosahedron' : 'Small Stellated Dodecahedron'"
          >
            1st Stell
          </button>
          <button 
            @click="jumpTo(2.0)" 
            class="btn-secondary" 
            :class="{ active: stellation === 2.0 }"
            :title="solidType === 'icosahedron' ? 'Great Icosahedron' : 'Great Dodecahedron'"
          >
            2nd Stell
          </button>
        </div>

        <!-- Playback Controls -->
        <div class="playback-controls-row">
          <button @click="step(-0.1)" class="btn-icon" title="Step Backward">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <button @click="togglePlay" class="btn-play" :class="{ playing: isPlaying }" :title="isPlaying ? 'Pause Autoplay' : 'Start Autoplay'">
            <svg v-if="!isPlaying" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"></rect>
              <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            </svg>
          </button>

          <button @click="step(0.1)" class="btn-icon" title="Step Forward">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <!-- Live Value Indicator -->
        <div class="indicator-badge">
          State: <span class="val-num">{{ stellation.toFixed(3) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

const isCollapsed = ref(false);

onMounted(() => {
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    isCollapsed.value = true;
  }
});

const props = withDefaults(defineProps<{
  stellation?: number;
  solidType?: 'dodecahedron' | 'icosahedron';
}>(), {
  stellation: 0,
  solidType: 'dodecahedron'
});

const emit = defineEmits(['stellation-change']);

const isPlaying = ref(false);
const isPausing = ref(false);
let animationFrameId: number | null = null;
let pauseTimeoutId: number | null = null;
let playDirection = 1; // 1 for forward, -1 for backward

const onSliderChange = (event: Event) => {
  if (isPlaying.value || isPausing.value) {
    pause();
  }
  const value = parseFloat((event.target as HTMLInputElement).value);
  emit('stellation-change', value);
};

const jumpTo = (val: number) => {
  if (isPlaying.value || isPausing.value) pause();
  emit('stellation-change', val);
};

const step = (delta: number) => {
  if (isPlaying.value || isPausing.value) pause();
  let val = props.stellation + delta;
  val = Math.max(0, Math.min(2, Math.round(val * 10) / 10));
  emit('stellation-change', val);
};

// Autoplay animation loop
const animate = () => {
  if (!isPlaying.value || isPausing.value) return;
  
  const speed = 0.0015; // Elegant, slow and smooth speed (about 3x slower)
  let nextVal = props.stellation + speed * playDirection;
  
  let shouldPause = false;
  let snapVal = nextVal;
  
  if (playDirection === 1) { // Moving forward
    if (props.stellation < 1.0 && nextVal >= 1.0) {
      snapVal = 1.0;
      shouldPause = true;
    } else if (props.stellation < 2.0 && nextVal >= 2.0) {
      snapVal = 2.0;
      playDirection = -1; // bounce back
      shouldPause = true;
    }
  } else { // Moving backward
    if (props.stellation > 1.0 && nextVal <= 1.0) {
      snapVal = 1.0;
      shouldPause = true;
    } else if (props.stellation > 0.0 && nextVal <= 0.0) {
      snapVal = 0.0;
      playDirection = 1; // bounce forward
      shouldPause = true;
    }
  }
  
  if (shouldPause) {
    emit('stellation-change', snapVal);
    isPausing.value = true;
    
    // Pause at stellation boundaries for exactly 2 seconds before resuming loop
    pauseTimeoutId = window.setTimeout(() => {
      isPausing.value = false;
      if (isPlaying.value) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }, 2000);
  } else {
    emit('stellation-change', nextVal);
    animationFrameId = requestAnimationFrame(animate);
  }
};

const startPlay = () => {
  isPlaying.value = true;
  isPausing.value = false;
  animate();
};

const pause = () => {
  isPlaying.value = false;
  isPausing.value = false;
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (pauseTimeoutId !== null) {
    clearTimeout(pauseTimeoutId);
    pauseTimeoutId = null;
  }
};

const togglePlay = () => {
  if (isPlaying.value || isPausing.value) {
    pause();
  } else {
    startPlay();
  }
};

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }
  if (pauseTimeoutId !== null) {
    clearTimeout(pauseTimeoutId);
  }
});

// Dynamic Legends based on stellation value
const phaseTitle = computed(() => {
  const s = props.stellation;
  const isIco = props.solidType === 'icosahedron';
  
  if (isIco) {
    if (s === 0.0) return 'Convex Regular Icosahedron';
    if (s === 1.0) return 'First Stellation (Small Triambic Icosahedron)';
    if (s === 2.0) return 'Second Stellation (Great Icosahedron)';
    if (s > 0.0 && s < 1.0) return 'Stellating Icosahedron...';
    return 'Morphing to Great Icosahedron...';
  } else {
    if (s === 0.0) return 'Convex Regular Dodecahedron';
    if (s === 1.0) return 'First Stellation (Small Stellated Dodecahedron)';
    if (s === 2.0) return 'Second Stellation (Great Dodecahedron)';
    if (s > 0.0 && s < 1.0) return 'Stellating Dodecahedron...';
    return 'Morphing to Great Dodecahedron...';
  }
});

const phaseDescription = computed(() => {
  const s = props.stellation;
  const isIco = props.solidType === 'icosahedron';
  
  if (isIco) {
    if (s === 0.0) {
      return 'The base Platonic solid composed of 20 equilateral triangular faces, 12 vertices, and 30 edges. The most complex convex regular polyhedron.';
    }
    if (s === 1.0) {
      return 'Small Triambic Icosahedron. The first stellation, formed by augmenting each of the 20 faces of the core icosahedron with a triangular pyramid. Its 32 vertices form a perfect outer dodecahedron layout.';
    }
    if (s === 2.0) {
      return 'Great Icosahedron. A Kepler-Poinsot regular star polyhedron, composed of 20 intersecting large equilateral triangles. It shares its 12 vertices and 30 edges with the regular icosahedron.';
    }
    if (s > 0.0 && s < 1.0) {
      return `Spikes are rising from the 20 triangular faces, growing outward to form the triambic pyramids (${Math.round(s * 100)}% complete).`;
    }
    return `Pyramid bases are expanding outward while their apexes remain as intersecting star planes meet to form the Great Icosahedron (${Math.round((s - 1) * 100)}% complete).`;
  } else {
    if (s === 0.0) {
      return 'The base Platonic solid featuring 12 flat, congruent regular pentagonal faces, 20 vertices, and 30 edges. Highly symmetric and perfectly convex.';
    }
    if (s === 1.0) {
      return 'Small Stellated Dodecahedron. Created by extending the faces of the dodecahedron outwards until they meet in 12 pentagonal pyramids. Shares its 12 vertex points with the regular icosahedron.';
    }
    if (s === 2.0) {
      return 'Great Dodecahedron. The second stellation, composed of 12 intersecting regular pentagonal faces. It shares its 12 vertices and 30 edges with the regular icosahedron, creating an intricate interlaced structure.';
    }
    if (s > 0.0 && s < 1.0) {
      return `Pyramids are rising from the 12 pentagonal faces. The centers are expanding outwards to become icosahedral vertices (${Math.round(s * 100)}% complete).`;
    }
    return `The original 20 dodecahedron vertices are now expanding outward to the stellation tips while the face centers invert to form intersecting regular pentagons (${Math.round((s - 1) * 100)}% complete).`;
  }
});
</script>

<style scoped>
.control-panel {
  width: 320px;
  position: absolute;
  left: 32px;
  top: 130px;
  bottom: auto;
  max-height: calc(100vh - 160px);
  padding: 24px;
  background: rgba(13, 13, 23, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 
              inset 0 1px 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 10;
  overflow-y: auto;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.control-panel:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.7), 
              inset 0 1px 2px rgba(255, 255, 255, 0.15);
}

.btn-collapse-toggle {
  display: none;
}

.description-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex-shrink: 0;
  height: 110px; /* Keep a constant vertical area for the text to prevent slider shifting and flickering */
}

.phase-title {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #00ffff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 10px rgba(0, 255, 255, 0.15);
}

.phase-desc {
  font-size: 0.85rem;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.7);
}

/* Controller Body columns */
.controller-body {
  display: flex;
  gap: 24px;
  align-items: stretch;
  height: 180px;
}

.slider-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 45px;
  height: 100%;
}

.value-display {
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

.slider-wrapper {
  position: relative;
  flex: 1;
  width: 24px;
  display: flex;
  justify-content: center;
}

.slider-wrapper::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  bottom: 0;
  width: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 0;
}

.stellation-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  outline: none;
  cursor: pointer;
  writing-mode: vertical-lr;
  direction: ltr;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.slider-fill {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  width: 6px;
  border-radius: 3px;
  background: linear-gradient(180deg, #00ffff, #ff00ff, #ffd700);
  z-index: 1;
  pointer-events: none;
  height: var(--percent);
}

.stellation-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 0.1s ease;
}

.stellation-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.stellation-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: transform 0.1s ease;
}

.stellation-slider::-moz-range-thumb:hover {
  transform: scale(1.2);
}

/* Right buttons column */
.buttons-column {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 10px;
}

.jump-group-vertical {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 4px;
}

.btn-secondary {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  padding: 6px 14px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
}

.btn-secondary:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.btn-secondary.active {
  color: #030303;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}

.playback-controls-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.btn-play {
  background: #ffffff;
  border: none;
  color: #0a0a0f;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.25);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.btn-play:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
}

.btn-play.playing {
  background: #ff007f;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(255, 0, 127, 0.4);
}

.btn-play.playing:hover {
  box-shadow: 0 6px 20px rgba(255, 0, 127, 0.6);
}

.indicator-badge {
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 6px 12px;
  border-radius: 10px;
  text-align: center;
  width: 100%;
}

.val-num {
  font-family: 'Courier New', monospace;
  color: #00ffff;
  font-weight: 700;
}

/* Responsive Overrides: Reverts to horizontal bottom dock on smaller screens */
@media (max-width: 768px) {
  .control-panel {
    width: calc(100% - 32px);
    max-width: 650px;
    height: auto;
    left: 16px;
    right: 16px;
    bottom: 16px;
    top: auto;
    transform: none;
    overflow-y: visible;
  }
  
  .description-box {
    height: auto;
  }
  
  .controller-body {
    flex-direction: column;
    min-height: auto;
    gap: 16px;
  }
  
  .slider-column {
    flex-direction: row;
    width: 100%;
    height: auto;
    gap: 16px;
    align-items: center;
  }
  
  .slider-wrapper {
    position: relative;
    flex: 1;
    height: 24px;
  }
  
  .slider-wrapper::before {
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    height: 6px;
  }
  
  .stellation-slider {
    writing-mode: horizontal-tb;
    direction: ltr;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  
  .slider-fill {
    left: 0;
    bottom: auto;
    top: 50%;
    transform: translateY(-50%);
    height: 6px;
    background: linear-gradient(90deg, #00ffff, #ff00ff, #ffd700);
    width: var(--percent);
  }
  
  .buttons-column {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    gap: 12px;
  }
  
  .jump-group-vertical {
    flex-direction: row;
    width: auto;
    flex: 1;
    min-width: 200px;
  }
  
  .jump-group-vertical .btn-secondary {
    flex: 1;
    padding: 6px 12px;
  }
  
  .playback-controls-row {
    flex: 0 0 auto;
  }
  
  .indicator-badge {
    flex: 1 0 100%;
    margin-top: 4px;
  }

  .btn-collapse-toggle {
    display: flex;
    position: absolute;
    top: 8px;
    right: 12px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: rgba(255, 255, 255, 0.7);
    width: 26px;
    height: 26px;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 15;
    transition: all 0.25s ease;
  }

  .btn-collapse-toggle:hover {
    background: rgba(255, 255, 255, 0.15);
    color: #fff;
  }

  .btn-collapse-toggle svg {
    transition: transform 0.3s ease;
  }

  /* Collapsed State Overrides on Mobile */
  .control-panel.collapsed {
    padding: 10px 16px 8px 16px;
    gap: 0;
  }

  .control-panel.collapsed .btn-collapse-toggle svg {
    transform: rotate(180deg);
  }

  .control-panel.collapsed .description-box {
    display: none;
  }

  .control-panel.collapsed .buttons-column {
    display: none;
  }

  .control-panel.collapsed .controller-body {
    height: auto;
    min-height: auto;
    margin: 0;
    padding: 0;
    gap: 0;
  }

  .control-panel.collapsed .slider-column {
    padding-right: 32px; /* Leave room for absolute collapse button */
    height: auto;
    margin: 0;
  }
}
</style>
