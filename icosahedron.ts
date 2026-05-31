export interface Vertex {
  x: number;
  y: number;
  z: number;
}

export interface FaceData {
  indices: number[];
  center: Vertex;
  normal: Vertex;
}

// Golden ratio
const PHI = (1 + Math.sqrt(5)) / 2;

// 1. Mathematically correct 12 vertices of a regular icosahedron
export const icosahedronVertices: Vertex[] = [
  { x: 0, y: 1, z: PHI },       // 0
  { x: 0, y: 1, z: -PHI },      // 1
  { x: 0, y: -1, z: PHI },      // 2
  { x: 0, y: -1, z: -PHI },     // 3
  { x: 1, y: PHI, z: 0 },       // 4
  { x: 1, y: -PHI, z: 0 },      // 5
  { x: -1, y: PHI, z: 0 },      // 6
  { x: -1, y: -PHI, z: 0 },     // 7
  { x: PHI, y: 0, z: 1 },       // 8
  { x: PHI, y: 0, z: -1 },      // 9
  { x: -PHI, y: 0, z: 1 },      // 10
  { x: -PHI, y: 0, z: -1 }      // 11
];

// 2. The 20 triangular faces of the regular icosahedron
export const icosahedronFacesIndices = [
  [0, 8, 4], [0, 4, 6], [0, 6, 10], [0, 10, 2], [0, 2, 8],
  [4, 9, 1], [6, 4, 1], [11, 6, 1], [3, 11, 1], [9, 3, 1],
  [5, 8, 2], [7, 5, 2], [10, 7, 2], [3, 9, 5], [3, 5, 7],
  [3, 7, 11], [4, 8, 9], [9, 8, 5], [11, 10, 6], [7, 10, 11]
];

// 3. Computed Face Data: Center & Outward Normal (CCW wound)
export const facesData: FaceData[] = icosahedronFacesIndices.map((fVerts) => {
  const center = { x: 0, y: 0, z: 0 };
  fVerts.forEach(vIdx => {
    const vertex = icosahedronVertices[vIdx];
    if (vertex) {
      center.x += vertex.x / 3;
      center.y += vertex.y / 3;
      center.z += vertex.z / 3;
    }
  });
  
  const p0 = icosahedronVertices[fVerts[0] ?? 0] ?? { x: 0, y: 0, z: 0 };
  const p1 = icosahedronVertices[fVerts[1] ?? 0] ?? { x: 0, y: 0, z: 0 };
  const p2 = icosahedronVertices[fVerts[2] ?? 0] ?? { x: 0, y: 0, z: 0 };
  
  const vA = { x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z };
  const vB = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
  
  let normal = {
    x: vA.y * vB.z - vA.z * vB.y,
    y: vA.z * vB.x - vA.x * vB.z,
    z: vA.x * vB.y - vA.y * vB.x
  };
  
  const dot = normal.x * center.x + normal.y * center.y + normal.z * center.z;
  let orderedVerts = [...fVerts];
  if (dot < 0) {
    orderedVerts.reverse();
    const rp0 = icosahedronVertices[orderedVerts[0] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const rp1 = icosahedronVertices[orderedVerts[1] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const rp2 = icosahedronVertices[orderedVerts[2] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const rvA = { x: rp1.x - rp0.x, y: rp1.y - rp0.y, z: rp1.z - rp0.z };
    const rvB = { x: rp2.x - rp1.x, y: rp2.y - rp1.y, z: rp2.z - rp1.z };
    normal = {
      x: rvA.y * rvB.z - rvA.z * rvB.y,
      y: rvA.z * rvB.x - rvA.x * rvB.z,
      z: rvA.x * rvB.y - rvA.y * rvB.x
    };
  }
  
  const len = Math.sqrt(normal.x**2 + normal.y**2 + normal.z**2);
  normal.x /= len;
  normal.y /= len;
  normal.z /= len;

  return {
    indices: orderedVerts,
    center,
    normal
  };
});

// 4. Find adjacent face indices for each edge of each face
const getAdjacentFaceIndex = (faceIdx: number, edgeStartIdx: number, edgeEndIdx: number): number => {
  for (let j = 0; j < 20; j++) {
    if (j === faceIdx) continue;
    const face = facesData[j];
    if (face) {
      const idxs = face.indices;
      if (idxs.includes(edgeStartIdx) && idxs.includes(edgeEndIdx)) {
        return j;
      }
    }
  }
  return 0; // fallback
};

export const adjacentFaces: number[][] = facesData.map((face, fIdx) => {
  return face.indices.map((vIdx, i) => {
    const nextVIdx = face.indices[(i + 1) % 3] ?? 0;
    return getAdjacentFaceIndex(fIdx, vIdx, nextVIdx);
  });
});

// 5. The 20 triangular faces of the Great Icosahedron (CCW wound)
export const greatIcosahedronFacesIndices = [
  [5, 1, 0], [0, 1, 7], [11, 5, 0], [0, 7, 9], [0, 9, 11],
  [1, 5, 10], [8, 7, 1], [10, 8, 1], [2, 3, 4], [6, 3, 2],
  [2, 4, 11], [9, 6, 2], [11, 9, 2], [10, 4, 3], [3, 6, 8],
  [3, 8, 10], [10, 5, 4], [4, 5, 11], [6, 7, 8], [9, 7, 6]
];

// 6. Geometric Apex Constants for Stellation
const firstFace = facesData[0];
const faceDistance = firstFace 
  ? Math.sqrt(firstFace.center.x**2 + firstFace.center.y**2 + firstFace.center.z**2) 
  : 1.51152;
// Apex scaling factor is exactly PHI^2 / sqrt(5) * sqrt(3) / d_face ~ 1.342
export const apexDistance = (Math.pow(PHI, 2) * Math.sqrt(3)) / Math.sqrt(5);

// ----------------------------------------------------
// static Float32Array positions and edges buffers generators
// ----------------------------------------------------

export const getIcosahedronBuffers = () => {
  // Layer 1: Core Icosahedron Solid Faces (20 faces * 3 vertices * 3 coords = 180 floats)
  const coreFacePositions = new Float32Array(20 * 3 * 3);
  let triCount = 0;
  facesData.forEach((face) => {
    const v0 = icosahedronVertices[face.indices[0] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const v1 = icosahedronVertices[face.indices[1] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const v2 = icosahedronVertices[face.indices[2] ?? 0] ?? { x: 0, y: 0, z: 0 };
    
    coreFacePositions[triCount * 9] = v0.x;
    coreFacePositions[triCount * 9 + 1] = v0.y;
    coreFacePositions[triCount * 9 + 2] = v0.z;
    coreFacePositions[triCount * 9 + 3] = v1.x;
    coreFacePositions[triCount * 9 + 4] = v1.y;
    coreFacePositions[triCount * 9 + 5] = v1.z;
    coreFacePositions[triCount * 9 + 6] = v2.x;
    coreFacePositions[triCount * 9 + 7] = v2.y;
    coreFacePositions[triCount * 9 + 8] = v2.z;
    triCount++;
  });

  // Layer 1: Core Icosahedron Edges (30 edges * 2 vertices * 3 coords = 180 floats)
  const coreEdgePositions = new Float32Array(30 * 2 * 3);
  let edgeIdx = 0;
  const seenEdges = new Set<string>();
  icosahedronFacesIndices.forEach(face => {
    for (let i = 0; i < 3; i++) {
      const v0 = face[i] ?? 0;
      const v1 = face[(i + 1) % 3] ?? 0;
      const min = Math.min(v0, v1);
      const max = Math.max(v0, v1);
      const key = `${min}-${max}`;
      if (!seenEdges.has(key)) {
        seenEdges.add(key);
        const pt0 = icosahedronVertices[min] ?? { x: 0, y: 0, z: 0 };
        const pt1 = icosahedronVertices[max] ?? { x: 0, y: 0, z: 0 };
        coreEdgePositions[edgeIdx * 6] = pt0.x;
        coreEdgePositions[edgeIdx * 6 + 1] = pt0.y;
        coreEdgePositions[edgeIdx * 6 + 2] = pt0.z;
        coreEdgePositions[edgeIdx * 6 + 3] = pt1.x;
        coreEdgePositions[edgeIdx * 6 + 4] = pt1.y;
        coreEdgePositions[edgeIdx * 6 + 5] = pt1.z;
        edgeIdx++;
      }
    }
  });

  // Layer 2: First Stellation Pyramids (20 faces * 3 triangles/pyramid * 3 vertices * 3 coords = 540 floats)
  const firstStellFacePositions = new Float32Array(20 * 3 * 3 * 3);
  let firstTriCount = 0;
  facesData.forEach((face, fIdx) => {
    const v0 = icosahedronVertices[face.indices[0] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const v1 = icosahedronVertices[face.indices[1] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const v2 = icosahedronVertices[face.indices[2] ?? 0] ?? { x: 0, y: 0, z: 0 };
    
    // Apex directly above the face center
    const apex = {
      x: face.normal.x * apexDistance,
      y: face.normal.y * apexDistance,
      z: face.normal.z * apexDistance
    };

    // Tri 1: apex -> v1 -> v0 (CCW)
    firstStellFacePositions[firstTriCount * 9] = apex.x;
    firstStellFacePositions[firstTriCount * 9 + 1] = apex.y;
    firstStellFacePositions[firstTriCount * 9 + 2] = apex.z;
    firstStellFacePositions[firstTriCount * 9 + 3] = v1.x;
    firstStellFacePositions[firstTriCount * 9 + 4] = v1.y;
    firstStellFacePositions[firstTriCount * 9 + 5] = v1.z;
    firstStellFacePositions[firstTriCount * 9 + 6] = v0.x;
    firstStellFacePositions[firstTriCount * 9 + 7] = v0.y;
    firstStellFacePositions[firstTriCount * 9 + 8] = v0.z;
    firstTriCount++;

    // Tri 2: apex -> v2 -> v1 (CCW)
    firstStellFacePositions[firstTriCount * 9] = apex.x;
    firstStellFacePositions[firstTriCount * 9 + 1] = apex.y;
    firstStellFacePositions[firstTriCount * 9 + 2] = apex.z;
    firstStellFacePositions[firstTriCount * 9 + 3] = v2.x;
    firstStellFacePositions[firstTriCount * 9 + 4] = v2.y;
    firstStellFacePositions[firstTriCount * 9 + 5] = v2.z;
    firstStellFacePositions[firstTriCount * 9 + 6] = v1.x;
    firstStellFacePositions[firstTriCount * 9 + 7] = v1.y;
    firstStellFacePositions[firstTriCount * 9 + 8] = v1.z;
    firstTriCount++;

    // Tri 3: apex -> v0 -> v2 (CCW)
    firstStellFacePositions[firstTriCount * 9] = apex.x;
    firstStellFacePositions[firstTriCount * 9 + 1] = apex.y;
    firstStellFacePositions[firstTriCount * 9 + 2] = apex.z;
    firstStellFacePositions[firstTriCount * 9 + 3] = v0.x;
    firstStellFacePositions[firstTriCount * 9 + 4] = v0.y;
    firstStellFacePositions[firstTriCount * 9 + 5] = v0.z;
    firstStellFacePositions[firstTriCount * 9 + 6] = v2.x;
    firstStellFacePositions[firstTriCount * 9 + 7] = v2.y;
    firstStellFacePositions[firstTriCount * 9 + 8] = v2.z;
    firstTriCount++;
  });

  // Layer 2: First Stellation Edges (20 faces * 3 pyramid edges * 2 vertices * 3 coords = 360 floats)
  const firstStellEdgePositions = new Float32Array(20 * 3 * 2 * 3);
  let firstEdgeIdx = 0;
  facesData.forEach((face) => {
    const v0 = icosahedronVertices[face.indices[0] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const v1 = icosahedronVertices[face.indices[1] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const v2 = icosahedronVertices[face.indices[2] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const apex = {
      x: face.normal.x * apexDistance,
      y: face.normal.y * apexDistance,
      z: face.normal.z * apexDistance
    };

    // Edge 1: apex -> v0
    firstStellEdgePositions[firstEdgeIdx * 6] = apex.x;
    firstStellEdgePositions[firstEdgeIdx * 6 + 1] = apex.y;
    firstStellEdgePositions[firstEdgeIdx * 6 + 2] = apex.z;
    firstStellEdgePositions[firstEdgeIdx * 6 + 3] = v0.x;
    firstStellEdgePositions[firstEdgeIdx * 6 + 4] = v0.y;
    firstStellEdgePositions[firstEdgeIdx * 6 + 5] = v0.z;
    firstEdgeIdx++;

    // Edge 2: apex -> v1
    firstStellEdgePositions[firstEdgeIdx * 6] = apex.x;
    firstStellEdgePositions[firstEdgeIdx * 6 + 1] = apex.y;
    firstStellEdgePositions[firstEdgeIdx * 6 + 2] = apex.z;
    firstStellEdgePositions[firstEdgeIdx * 6 + 3] = v1.x;
    firstStellEdgePositions[firstEdgeIdx * 6 + 4] = v1.y;
    firstStellEdgePositions[firstEdgeIdx * 6 + 5] = v1.z;
    firstEdgeIdx++;

    // Edge 3: apex -> v2
    firstStellEdgePositions[firstEdgeIdx * 6] = apex.x;
    firstStellEdgePositions[firstEdgeIdx * 6 + 1] = apex.y;
    firstStellEdgePositions[firstEdgeIdx * 6 + 2] = apex.z;
    firstStellEdgePositions[firstEdgeIdx * 6 + 3] = v2.x;
    firstStellEdgePositions[firstEdgeIdx * 6 + 4] = v2.y;
    firstStellEdgePositions[firstEdgeIdx * 6 + 5] = v2.z;
    firstEdgeIdx++;
  });

  // Layer 3: Great Icosahedron Faces (20 intersecting faces * 3 vertices * 3 coords = 180 floats)
  const secondStellFacePositions = new Float32Array(20 * 3 * 3);
  let greatTriCount = 0;
  greatIcosahedronFacesIndices.forEach((face) => {
    const v0 = icosahedronVertices[face[0] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const v1 = icosahedronVertices[face[1] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const v2 = icosahedronVertices[face[2] ?? 0] ?? { x: 0, y: 0, z: 0 };

    secondStellFacePositions[greatTriCount * 9] = v0.x;
    secondStellFacePositions[greatTriCount * 9 + 1] = v0.y;
    secondStellFacePositions[greatTriCount * 9 + 2] = v0.z;
    secondStellFacePositions[greatTriCount * 9 + 3] = v1.x;
    secondStellFacePositions[greatTriCount * 9 + 4] = v1.y;
    secondStellFacePositions[greatTriCount * 9 + 5] = v1.z;
    secondStellFacePositions[greatTriCount * 9 + 6] = v2.x;
    secondStellFacePositions[greatTriCount * 9 + 7] = v2.y;
    secondStellFacePositions[greatTriCount * 9 + 8] = v2.z;
    greatTriCount++;
  });

  // Layer 3: Great Icosahedron Edges (30 edges * 2 vertices * 3 coords = 180 floats)
  const secondStellEdgePositions = new Float32Array(30 * 2 * 3);
  let greatEdgeIdx = 0;
  const seenGreatEdges = new Set<string>();
  greatIcosahedronFacesIndices.forEach((face) => {
    for (let i = 0; i < 3; i++) {
      const v0 = face[i] ?? 0;
      const v1 = face[(i + 1) % 3] ?? 0;
      const min = Math.min(v0, v1);
      const max = Math.max(v0, v1);
      const key = `${min}-${max}`;
      if (!seenGreatEdges.has(key)) {
        seenGreatEdges.add(key);
        const pt0 = icosahedronVertices[min] ?? { x: 0, y: 0, z: 0 };
        const pt1 = icosahedronVertices[max] ?? { x: 0, y: 0, z: 0 };
        
        secondStellEdgePositions[greatEdgeIdx * 6] = pt0.x;
        secondStellEdgePositions[greatEdgeIdx * 6 + 1] = pt0.y;
        secondStellEdgePositions[greatEdgeIdx * 6 + 2] = pt0.z;
        secondStellEdgePositions[greatEdgeIdx * 6 + 3] = pt1.x;
        secondStellEdgePositions[greatEdgeIdx * 6 + 4] = pt1.y;
        secondStellEdgePositions[greatEdgeIdx * 6 + 5] = pt1.z;
        greatEdgeIdx++;
      }
    }
  });

  return {
    coreFacePositions,
    coreEdgePositions,
    firstStellFacePositions,
    firstStellEdgePositions,
    secondStellFacePositions,
    secondStellEdgePositions
  };
};
