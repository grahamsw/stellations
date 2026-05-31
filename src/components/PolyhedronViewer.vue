<template>
  <div class="dodecahedron-viewer">
    <TresCanvas clear-color="transparent" alpha>
      <TresPerspectiveCamera :position="[0, 0, 8.8]" :fov="45" />
      <OrbitControls :enable-damping="true" :damping-factor="0.05" />
      
      <!-- Studio Quality Three-Point Lighting -->
      <TresAmbientLight :intensity="1.2" />
      <!-- Warm Key Light -->
      <TresDirectionalLight :position="[6, 6, 6]" :intensity="2.5" color="#ffd6cc" />
      <!-- Cool Fill Light -->
      <TresDirectionalLight :position="[-6, -4, 3]" :intensity="1.8" color="#cce6ff" />
      <!-- Back Rim Light -->
      <TresDirectionalLight :position="[0, 6, -6]" :intensity="1.5" color="#e6ccff" />

      <!-- LAYER 1: Core Polyhedron (Cyan) - Rendered 1st -->
      <TresGroup :render-order="1">
        <!-- Solid Faces (Opaque) -->
        <TresMesh v-if="liveCoreOpacity >= 1.0">
          <TresBufferGeometry>
            <TresBufferAttribute
              attach="attributes-position"
              :array="activeBuffers.coreFace"
              :count="activeBuffers.coreCount"
              :item-size="3"
            />
          </TresBufferGeometry>
          <TresMeshStandardMaterial
            :color="config.coreColor"
            :roughness="0.1"
            :metalness="0.9"
            :transparent="false"
            :opacity="1.0"
            :depthWrite="true"
          />
        </TresMesh>
        <!-- Solid Faces (Transparent) -->
        <TresMesh v-else>
          <TresBufferGeometry>
            <TresBufferAttribute
              attach="attributes-position"
              :array="activeBuffers.coreFace"
              :count="activeBuffers.coreCount"
              :item-size="3"
            />
          </TresBufferGeometry>
          <TresMeshStandardMaterial
            :color="config.coreColor"
            :roughness="0.3"
            :metalness="0.1"
            :transparent="true"
            :opacity="liveCoreOpacity"
            :depthWrite="false"
          />
        </TresMesh>
        <!-- Clean Outer Edges -->
        <TresLineSegments>
          <TresBufferGeometry>
            <TresBufferAttribute
              attach="attributes-position"
              :array="activeBuffers.coreEdge"
              :count="activeBuffers.coreEdgeCount"
              :item-size="3"
            />
          </TresBufferGeometry>
          <TresLineBasicMaterial
            :color="config.coreColor"
            :transparent="liveCoreEdgeOpacity < 1.0"
            :opacity="liveCoreEdgeOpacity"
          />
        </TresLineSegments>
      </TresGroup>

      <!-- LAYER 2: First Stellation (Magenta) - Rendered 2nd -->
      <TresGroup v-if="stellation > 0" :render-order="2">
        <!-- Solid Faces (Opaque) -->
        <TresMesh v-if="liveFirstStellOpacity >= 1.0">
          <TresBufferGeometry>
            <TresBufferAttribute
              attach="attributes-position"
              :array="activeBuffers.firstFace"
              :count="activeBuffers.firstCount"
              :item-size="3"
            />
          </TresBufferGeometry>
          <TresMeshStandardMaterial
            :color="config.firstColor"
            :roughness="0.15"
            :metalness="0.85"
            :transparent="false"
            :opacity="1.0"
            :depthWrite="true"
          />
        </TresMesh>
        <!-- Solid Faces (Transparent) -->
        <TresMesh v-else>
          <TresBufferGeometry>
            <TresBufferAttribute
              attach="attributes-position"
              :array="activeBuffers.firstFace"
              :count="activeBuffers.firstCount"
              :item-size="3"
            />
          </TresBufferGeometry>
          <TresMeshStandardMaterial
            :color="config.firstColor"
            :roughness="0.3"
            :metalness="0.1"
            :transparent="true"
            :opacity="liveFirstStellOpacity"
            :depthWrite="false"
          />
        </TresMesh>
        <!-- Clean Outer Edges -->
        <TresLineSegments>
          <TresBufferGeometry>
            <TresBufferAttribute
              attach="attributes-position"
              :array="activeBuffers.firstEdge"
              :count="activeBuffers.firstEdgeCount"
              :item-size="3"
            />
          </TresBufferGeometry>
          <TresLineBasicMaterial
            :color="config.firstColor"
            :transparent="liveFirstStellEdgeOpacity < 1.0"
            :opacity="liveFirstStellEdgeOpacity"
          />
        </TresLineSegments>
      </TresGroup>

      <!-- LAYER 3: Second Stellation (Gold) - Rendered 3rd -->
      <TresGroup v-if="stellation > 1.0" :render-order="3">
        <!-- Solid Faces (Opaque) -->
        <TresMesh v-if="liveSecondStellOpacity >= 1.0">
          <TresBufferGeometry>
            <TresBufferAttribute
              attach="attributes-position"
              :array="activeBuffers.secondFace"
              :count="activeBuffers.secondCount"
              :item-size="3"
            />
          </TresBufferGeometry>
          <TresMeshStandardMaterial
            :color="config.secondColor"
            :roughness="0.15"
            :metalness="0.85"
            :transparent="false"
            :opacity="1.0"
            :depthWrite="true"
          />
        </TresMesh>
        <!-- Solid Faces (Transparent) -->
        <TresMesh v-else>
          <TresBufferGeometry>
            <TresBufferAttribute
              attach="attributes-position"
              :array="activeBuffers.secondFace"
              :count="activeBuffers.secondCount"
              :item-size="3"
            />
          </TresBufferGeometry>
          <TresMeshStandardMaterial
            :color="config.secondColor"
            :roughness="0.3"
            :metalness="0.1"
            :transparent="true"
            :opacity="liveSecondStellOpacity"
            :depthWrite="false"
          />
        </TresMesh>
        <!-- Clean Outer Edges -->
        <TresLineSegments>
          <TresBufferGeometry>
            <TresBufferAttribute
              attach="attributes-position"
              :array="activeBuffers.secondEdge"
              :count="activeBuffers.secondEdgeCount"
              :item-size="3"
            />
          </TresBufferGeometry>
          <TresLineBasicMaterial
            :color="config.secondColor"
            :transparent="liveSecondStellEdgeOpacity < 1.0"
            :opacity="liveSecondStellEdgeOpacity"
          />
        </TresLineSegments>
      </TresGroup>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { 
  dodecahedronVertices, 
  dodecahedronFacesIndices, 
  facesData as dodecaFacesData, 
  adjacentFaces as dodecaAdjacentFaces 
} from '../../dodecahedron';
import { getIcosahedronBuffers } from '../../icosahedron';

// Phase-specific Material configuration interface
interface MaterialConfig {
  overrideScaling: boolean;
  coreColor: string;
  firstColor: string;
  secondColor: string;
  
  // Phase 0: Base
  coreOpacity0: number;
  coreEdgeOpacity0: number;
  
  // Phase 1: 1st Stellation
  firstOpacity1: number;
  coreOpacity1: number;
  firstEdgeOpacity1: number;
  
  // Phase 2: 2nd Stellation
  secondOpacity2: number;
  firstOpacity2: number;
  coreOpacity2: number;
  secondEdgeOpacity2: number;
}

const props = withDefaults(defineProps<{
  stellation?: number;
  solidType?: 'dodecahedron' | 'icosahedron';
  config: MaterialConfig;
}>(), {
  stellation: 0,
  solidType: 'dodecahedron'
});

// Linear interpolation utility
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ----------------------------------------------------
// DYNAMIC MORPHING CONCENTRIC OPACITIES
// ----------------------------------------------------

const liveCoreOpacity = computed(() => {
  const s = props.stellation;
  if (props.config.overrideScaling) {
    if (s === 0.0) return props.config.coreOpacity0;
    if (s <= 1.0) return props.config.coreOpacity1;
    return props.config.coreOpacity2;
  }
  
  if (s <= 1.0) {
    return lerp(props.config.coreOpacity0, props.config.coreOpacity1, s);
  } else {
    return lerp(props.config.coreOpacity1, props.config.coreOpacity2, s - 1.0);
  }
});

const liveCoreEdgeOpacity = computed(() => {
  const s = props.stellation;
  if (props.config.overrideScaling) {
    if (s === 0.0) return props.config.coreEdgeOpacity0;
    if (s <= 1.0) return props.config.coreEdgeOpacity0 * (props.config.coreOpacity1 / Math.max(props.config.coreOpacity0, 0.01));
    return props.config.coreEdgeOpacity0 * (props.config.coreOpacity2 / Math.max(props.config.coreOpacity0, 0.01));
  }
  
  const ratio = liveCoreOpacity.value / Math.max(props.config.coreOpacity0, 0.01);
  return props.config.coreEdgeOpacity0 * ratio;
});

const liveFirstStellOpacity = computed(() => {
  const s = props.stellation;
  if (props.config.overrideScaling) {
    if (s === 0.0) return 0.0;
    if (s <= 1.0) return props.config.firstOpacity1;
    return props.config.firstOpacity2;
  }
  
  if (s <= 1.0) {
    return lerp(0.0, props.config.firstOpacity1, s);
  } else {
    return lerp(props.config.firstOpacity1, props.config.firstOpacity2, s - 1.0);
  }
});

const liveFirstStellEdgeOpacity = computed(() => {
  const s = props.stellation;
  if (props.config.overrideScaling) {
    if (s === 0.0) return 0.0;
    if (s <= 1.0) return props.config.firstEdgeOpacity1;
    return props.config.firstEdgeOpacity1 * (props.config.firstOpacity2 / Math.max(props.config.firstOpacity1, 0.01));
  }
  
  if (s <= 1.0) {
    return lerp(0.0, props.config.firstEdgeOpacity1, s);
  } else {
    const ratio = liveFirstStellOpacity.value / Math.max(props.config.firstOpacity1, 0.01);
    return props.config.firstEdgeOpacity1 * ratio;
  }
});

const liveSecondStellOpacity = computed(() => {
  const s = props.stellation;
  if (props.config.overrideScaling) {
    if (s <= 1.0) return 0.0;
    return props.config.secondOpacity2;
  }
  
  if (s <= 1.0) {
    return 0.0;
  } else {
    return lerp(0.0, props.config.secondOpacity2, s - 1.0);
  }
});

const liveSecondStellEdgeOpacity = computed(() => {
  const s = props.stellation;
  if (props.config.overrideScaling) {
    if (s <= 1.0) return 0.0;
    return props.config.secondEdgeOpacity2;
  }
  
  if (s <= 1.0) {
    return 0.0;
  } else {
    return lerp(0.0, props.config.secondEdgeOpacity2, s - 1.0);
  }
});

// ----------------------------------------------------
// DODECAHEDRON STATIC BUFFERS GENERATION
// ----------------------------------------------------
const firstDodecaFace = dodecaFacesData[0];
const dodecaFaceDistance = firstDodecaFace 
  ? Math.sqrt(firstDodecaFace.center.x**2 + firstDodecaFace.center.y**2 + firstDodecaFace.center.z**2) 
  : 1.37638;
const dodecaApexDistance = Math.sqrt(5) * dodecaFaceDistance;

const dodecaFacePositions = (() => {
  const pos = new Float32Array(60 * 3 * 3);
  let triCount = 0;
  for (let k = 0; k < 12; k++) {
    const face = dodecaFacesData[k] ?? { indices: [], center: { x: 0, y: 0, z: 0 } };
    const fc = face.center;
    for (let i = 0; i < 5; i++) {
      const v0Idx = face.indices[i] ?? 0;
      const v1Idx = face.indices[(i + 1) % 5] ?? 0;
      const v0 = dodecahedronVertices[v0Idx] ?? { x: 0, y: 0, z: 0 };
      const v1 = dodecahedronVertices[v1Idx] ?? { x: 0, y: 0, z: 0 };
      
      pos[triCount * 9] = fc.x;
      pos[triCount * 9 + 1] = fc.y;
      pos[triCount * 9 + 2] = fc.z;
      pos[triCount * 9 + 3] = v0.x;
      pos[triCount * 9 + 4] = v0.y;
      pos[triCount * 9 + 5] = v0.z;
      pos[triCount * 9 + 6] = v1.x;
      pos[triCount * 9 + 7] = v1.y;
      pos[triCount * 9 + 8] = v1.z;
      triCount++;
    }
  }
  return pos;
})();

const dodecaEdgePositions = (() => {
  const edgePos = new Float32Array(30 * 2 * 3);
  let edgeIdx = 0;
  const seenEdges = new Set<string>();
  dodecahedronFacesIndices.forEach(face => {
    for (let i = 0; i < 5; i++) {
      const v0 = face[i] ?? 0;
      const v1 = face[(i + 1) % 5] ?? 0;
      const min = Math.min(v0, v1);
      const max = Math.max(v0, v1);
      const key = `${min}-${max}`;
      if (!seenEdges.has(key)) {
        seenEdges.add(key);
        const pt0 = dodecahedronVertices[min] ?? { x: 0, y: 0, z: 0 };
        const pt1 = dodecahedronVertices[max] ?? { x: 0, y: 0, z: 0 };
        edgePos[edgeIdx * 6] = pt0.x;
        edgePos[edgeIdx * 6 + 1] = pt0.y;
        edgePos[edgeIdx * 6 + 2] = pt0.z;
        edgePos[edgeIdx * 6 + 3] = pt1.x;
        edgePos[edgeIdx * 6 + 4] = pt1.y;
        edgePos[edgeIdx * 6 + 5] = pt1.z;
        edgeIdx++;
      }
    }
  });
  return edgePos;
})();

const dodecaFirstFacePositions = (() => {
  const pos = new Float32Array(60 * 3 * 3);
  let triCount = 0;
  for (let k = 0; k < 12; k++) {
    const face = dodecaFacesData[k] ?? { indices: [] };
    const adj = dodecaAdjacentFaces[k] ?? [];
    for (let i = 0; i < 5; i++) {
      const v0Idx = face.indices[i] ?? 0;
      const v1Idx = face.indices[(i + 1) % 5] ?? 0;
      const adjFaceIdx = adj[i] ?? 0;
      const v0 = dodecahedronVertices[v0Idx] ?? { x: 0, y: 0, z: 0 };
      const v1 = dodecahedronVertices[v1Idx] ?? { x: 0, y: 0, z: 0 };
      const adjFace = dodecaFacesData[adjFaceIdx] ?? { normal: { x: 0, y: 0, z: 0 } };
      const adjApex = {
        x: adjFace.normal.x * dodecaApexDistance,
        y: adjFace.normal.y * dodecaApexDistance,
        z: adjFace.normal.z * dodecaApexDistance
      };
      
      pos[triCount * 9] = adjApex.x;
      pos[triCount * 9 + 1] = adjApex.y;
      pos[triCount * 9 + 2] = adjApex.z;
      pos[triCount * 9 + 3] = v1.x;
      pos[triCount * 9 + 4] = v1.y;
      pos[triCount * 9 + 5] = v1.z;
      pos[triCount * 9 + 6] = v0.x;
      pos[triCount * 9 + 7] = v0.y;
      pos[triCount * 9 + 8] = v0.z;
      triCount++;
    }
  }
  return pos;
})();

const dodecaFirstEdgePositions = (() => {
  const edgePos = new Float32Array(60 * 2 * 3);
  let edgeIdx = 0;
  for (let k = 0; k < 12; k++) {
    const face = dodecaFacesData[k] ?? { indices: [] };
    const adj = dodecaAdjacentFaces[k] ?? [];
    for (let i = 0; i < 5; i++) {
      const v0Idx = face.indices[i] ?? 0;
      const v1Idx = face.indices[(i + 1) % 5] ?? 0;
      const adjFaceIdx = adj[i] ?? 0;
      const v0 = dodecahedronVertices[v0Idx] ?? { x: 0, y: 0, z: 0 };
      const v1 = dodecahedronVertices[v1Idx] ?? { x: 0, y: 0, z: 0 };
      const adjFace = dodecaFacesData[adjFaceIdx] ?? { normal: { x: 0, y: 0, z: 0 } };
      const adjApex = {
        x: adjFace.normal.x * dodecaApexDistance,
        y: adjFace.normal.y * dodecaApexDistance,
        z: adjFace.normal.z * dodecaApexDistance
      };
      
      edgePos[edgeIdx * 6] = adjApex.x;
      edgePos[edgeIdx * 6 + 1] = adjApex.y;
      edgePos[edgeIdx * 6 + 2] = adjApex.z;
      edgePos[edgeIdx * 6 + 3] = v0.x;
      edgePos[edgeIdx * 6 + 4] = v0.y;
      edgePos[edgeIdx * 6 + 5] = v0.z;
      edgeIdx++;
      
      edgePos[edgeIdx * 6] = adjApex.x;
      edgePos[edgeIdx * 6 + 1] = adjApex.y;
      edgePos[edgeIdx * 6 + 2] = adjApex.z;
      edgePos[edgeIdx * 6 + 3] = v1.x;
      edgePos[edgeIdx * 6 + 4] = v1.y;
      edgePos[edgeIdx * 6 + 5] = v1.z;
      edgeIdx++;
    }
  }
  return edgePos;
})();

const dodecaSecondFacePositions = (() => {
  const pos = new Float32Array(60 * 3 * 3);
  let triCount = 0;
  for (let k = 0; k < 12; k++) {
    const face = dodecaFacesData[k] ?? { indices: [] };
    const adj = dodecaAdjacentFaces[k] ?? [];
    for (let i = 0; i < 5; i++) {
      const vIdx = face.indices[i] ?? 0;
      const adjFaceIdx = adj[i] ?? 0;
      const prevAdjFaceIdx = adj[(i - 1 + 5) % 5] ?? 0;
      const v = dodecahedronVertices[vIdx] ?? { x: 0, y: 0, z: 0 };
      const adjFace = dodecaFacesData[adjFaceIdx] ?? { normal: { x: 0, y: 0, z: 0 } };
      const prevAdjFace = dodecaFacesData[prevAdjFaceIdx] ?? { normal: { x: 0, y: 0, z: 0 } };
      const adjApex = {
        x: adjFace.normal.x * dodecaApexDistance,
        y: adjFace.normal.y * dodecaApexDistance,
        z: adjFace.normal.z * dodecaApexDistance
      };
      const prevApex = {
        x: prevAdjFace.normal.x * dodecaApexDistance,
        y: prevAdjFace.normal.y * dodecaApexDistance,
        z: prevAdjFace.normal.z * dodecaApexDistance
      };
      
      pos[triCount * 9] = v.x;
      pos[triCount * 9 + 1] = v.y;
      pos[triCount * 9 + 2] = v.z;
      pos[triCount * 9 + 3] = prevApex.x;
      pos[triCount * 9 + 4] = prevApex.y;
      pos[triCount * 9 + 5] = prevApex.z;
      pos[triCount * 9 + 6] = adjApex.x;
      pos[triCount * 9 + 7] = adjApex.y;
      pos[triCount * 9 + 8] = adjApex.z;
      triCount++;
    }
  }
  return pos;
})();

const dodecaSecondEdgePositions = (() => {
  const seenOuterEdges = new Set<string>();
  const outerEdgePosList: number[] = [];
  for (let k = 0; k < 12; k++) {
    const face = dodecaFacesData[k] ?? { normal: { x: 0, y: 0, z: 0 } };
    const Ak = {
      x: face.normal.x * dodecaApexDistance,
      y: face.normal.y * dodecaApexDistance,
      z: face.normal.z * dodecaApexDistance
    };
    const adj = dodecaAdjacentFaces[k] ?? [];
    for (let i = 0; i < 5; i++) {
      const j = adj[i] ?? 0;
      const min = Math.min(k, j);
      const max = Math.max(k, j);
      const key = `${min}-${max}`;
      if (!seenOuterEdges.has(key)) {
        seenOuterEdges.add(key);
        const adjFace = dodecaFacesData[j] ?? { normal: { x: 0, y: 0, z: 0 } };
        const Aj = {
          x: adjFace.normal.x * dodecaApexDistance,
          y: adjFace.normal.y * dodecaApexDistance,
          z: adjFace.normal.z * dodecaApexDistance
        };
        outerEdgePosList.push(Ak.x, Ak.y, Ak.z, Aj.x, Aj.y, Aj.z);
      }
    }
  }
  return new Float32Array(outerEdgePosList);
})();

// ----------------------------------------------------
// ICOSAHEDRON STATIC BUFFERS GENERATION
// ----------------------------------------------------
const icosaBuffers = getIcosahedronBuffers();

// ----------------------------------------------------
// DYNAMIC DUAL SOLID ACTIVE BUFFERS MAPPING
// ----------------------------------------------------
const activeBuffers = computed(() => {
  if (props.solidType === 'icosahedron') {
    return {
      coreFace: icosaBuffers.coreFacePositions,
      coreEdge: icosaBuffers.coreEdgePositions,
      firstFace: icosaBuffers.firstStellFacePositions,
      firstEdge: icosaBuffers.firstStellEdgePositions,
      secondFace: icosaBuffers.secondStellFacePositions,
      secondEdge: icosaBuffers.secondStellEdgePositions,
      
      coreCount: 60,       // 20 faces * 3 vertices = 60 vertices
      coreEdgeCount: 60,   // 30 edges * 2 vertices = 60 vertices
      firstCount: 180,     // 20 faces * 3 triangles * 3 vertices = 180 vertices
      firstEdgeCount: 120, // 20 faces * 3 edges * 2 vertices = 120 vertices
      secondCount: 60,     // 20 faces * 3 vertices = 60 vertices
      secondEdgeCount: 60  // 30 edges * 2 vertices = 60 vertices
    };
  } else {
    return {
      coreFace: dodecaFacePositions,
      coreEdge: dodecaEdgePositions,
      firstFace: dodecaFirstFacePositions,
      firstEdge: dodecaFirstEdgePositions,
      secondFace: dodecaSecondFacePositions,
      secondEdge: dodecaSecondEdgePositions,
      
      coreCount: 180,      // 12 faces * 5 triangles * 3 vertices = 180 vertices
      coreEdgeCount: 60,   // 30 edges * 2 vertices = 60 vertices
      firstCount: 180,     // 12 faces * 5 triangles * 3 vertices = 180 vertices
      firstEdgeCount: 120, // 60 edges * 2 vertices = 120 vertices
      secondCount: 180,    // 12 faces * 5 triangles * 3 vertices = 180 vertices
      secondEdgeCount: 60  // 30 edges * 2 vertices = 60 vertices
    };
  }
});
</script>

<style scoped>
.dodecahedron-viewer {
  width: 100%;
  height: 100%;
  display: block;
  position: relative;
  touch-action: none;
}
</style>
