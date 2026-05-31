export interface Vertex {
  x: number;
  y: number;
  z: number;
}

export interface Face {
  vertices: number[]; // indices of vertices
}

export interface Dodecahedron {
  vertices: Vertex[];
  faces: Face[];
}

// Golden ratio
const PHI = (1 + Math.sqrt(5)) / 2;
const INV_PHI = 1 / PHI;

// Mathematically correct 20 vertices of a regular dodecahedron
export const dodecahedronVertices: Vertex[] = [
  { x: 1, y: 1, z: 1 },       // 0
  { x: 1, y: 1, z: -1 },      // 1
  { x: 1, y: -1, z: 1 },      // 2
  { x: 1, y: -1, z: -1 },     // 3
  { x: -1, y: 1, z: 1 },      // 4
  { x: -1, y: 1, z: -1 },     // 5
  { x: -1, y: -1, z: 1 },     // 6
  { x: -1, y: -1, z: -1 },    // 7
  { x: 0, y: INV_PHI, z: PHI },   // 8
  { x: 0, y: INV_PHI, z: -PHI },  // 9
  { x: 0, y: -INV_PHI, z: PHI },  // 10
  { x: 0, y: -INV_PHI, z: -PHI }, // 11
  { x: INV_PHI, y: PHI, z: 0 },   // 12
  { x: INV_PHI, y: -PHI, z: 0 },  // 13
  { x: -INV_PHI, y: PHI, z: 0 },  // 14
  { x: -INV_PHI, y: -PHI, z: 0 }, // 15
  { x: PHI, y: 0, z: INV_PHI },   // 16
  { x: PHI, y: 0, z: -INV_PHI },  // 17
  { x: -PHI, y: 0, z: INV_PHI },  // 18
  { x: -PHI, y: 0, z: -INV_PHI }  // 19
];

// The 12 pentagonal faces of the dodecahedron (indices into dodecahedronVertices)
export const dodecahedronFacesIndices = [
  [ 12, 14, 4, 8, 0 ],
  [ 0, 8, 10, 2, 16 ],
  [ 16, 17, 1, 12, 0 ],
  [ 1, 9, 5, 14, 12 ],
  [ 17, 3, 11, 9, 1 ],
  [ 2, 10, 6, 15, 13 ],
  [ 2, 13, 3, 17, 16 ],
  [ 13, 15, 7, 11, 3 ],
  [ 18, 6, 10, 8, 4 ],
  [ 4, 14, 5, 19, 18 ],
  [ 5, 9, 11, 7, 19 ],
  [ 18, 19, 7, 15, 6 ]
];

// Face normal and center calculation
export interface FaceData {
  indices: number[];
  center: Vertex;
  normal: Vertex;
}

export const facesData: FaceData[] = dodecahedronFacesIndices.map((fVerts) => {
  // Compute face center
  const center = { x: 0, y: 0, z: 0 };
  fVerts.forEach(vIdx => {
    const vertex = dodecahedronVertices[vIdx];
    if (vertex) {
      center.x += vertex.x / 5;
      center.y += vertex.y / 5;
      center.z += vertex.z / 5;
    }
  });
  
  // Vector cross product to find normal
  const p0 = dodecahedronVertices[fVerts[0] ?? 0] ?? { x: 0, y: 0, z: 0 };
  const p1 = dodecahedronVertices[fVerts[1] ?? 0] ?? { x: 0, y: 0, z: 0 };
  const p2 = dodecahedronVertices[fVerts[2] ?? 0] ?? { x: 0, y: 0, z: 0 };
  const vA = { x: p1.x - p0.x, y: p1.y - p0.y, z: p1.z - p0.z };
  const vB = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
  
  let normal = {
    x: vA.y * vB.z - vA.z * vB.y,
    y: vA.z * vB.x - vA.x * vB.z,
    z: vA.x * vB.y - vA.y * vB.x
  };
  
  // Orient outward
  const dot = normal.x * center.x + normal.y * center.y + normal.z * center.z;
  let orderedVerts = [...fVerts];
  if (dot < 0) {
    orderedVerts.reverse();
    // Re-verify normal
    const rp0 = dodecahedronVertices[orderedVerts[0] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const rp1 = dodecahedronVertices[orderedVerts[1] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const rp2 = dodecahedronVertices[orderedVerts[2] ?? 0] ?? { x: 0, y: 0, z: 0 };
    const rvA = { x: rp1.x - rp0.x, y: rp1.y - rp0.y, z: rp1.z - rp0.z };
    const rvB = { x: rp2.x - rp1.x, y: rp2.y - rp1.y, z: rp2.z - rp1.z };
    normal = {
      x: rvA.y * rvB.z - rvA.z * rvB.y,
      y: rvA.z * rvB.x - rvA.x * rvB.z,
      z: rvA.x * rvB.y - rvA.y * rvB.x
    };
  }
  
  // Normalize normal
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

// For each face, find adjacent face index for each edge
const getAdjacentFaceIndex = (faceIdx: number, edgeStartIdx: number, edgeEndIdx: number): number => {
  for (let j = 0; j < 12; j++) {
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
    const nextVIdx = face.indices[(i + 1) % 5] ?? 0;
    return getAdjacentFaceIndex(fIdx, vIdx, nextVIdx);
  });
});

// Geometric Constants
const firstFace = facesData[0];
const faceDistance = firstFace 
  ? Math.sqrt(firstFace.center.x**2 + firstFace.center.y**2 + firstFace.center.z**2) 
  : 1.37638;
const apexDistance = Math.sqrt(5) * faceDistance; // Apex factor of stellation is sqrt(5)

// Expose legacy interfaces for compatibility
export const BASE_DODECAHEDRON: Dodecahedron = {
  vertices: dodecahedronVertices,
  faces: dodecahedronFacesIndices.map(f => ({ vertices: f }))
};

export const FIRST_STELLATION = BASE_DODECAHEDRON;
export const SECOND_STELLATION = BASE_DODECAHEDRON;

export function interpolateStellation(_t: number, from: Dodecahedron, _to: Dodecahedron): Dodecahedron {
  return from;
}

/**
 * Computes flat positions array and indices array for a given stellation value in range [0, 2]
 * 0.0: Regular Dodecahedron (12 flat pentagonal faces)
 * 1.0: Small Stellated Dodecahedron (12 pentagrammic pyramids)
 * 2.0: Great Dodecahedron (12 intersecting regular pentagons)
 */
export function getDodecahedronGeometry(s: number): { positions: Float32Array; indices: Uint16Array } {
  // 72 vertices in total (12 faces x 6 vertices: 5 outer, 1 center)
  const positions = new Float32Array(72 * 3);
  
  // Linear interpolation function
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  for (let k = 0; k < 12; k++) {
    const face = facesData[k] ?? { indices: [], center: { x: 0, y: 0, z: 0 }, normal: { x: 0, y: 0, z: 0 } };
    const adj = adjacentFaces[k] ?? [];
    
    // Base Face Center
    const fc = face.center;
    // Apex Center (State 1 & 2)
    const ac = {
      x: face.normal.x * apexDistance,
      y: face.normal.y * apexDistance,
      z: face.normal.z * apexDistance
    };

    // Determine current center vertex position C_k
    let centerPos = { x: 0, y: 0, z: 0 };
    if (s <= 1.0) {
      // Transition from Dodecahedron Center to Small Stellated Dodecahedron Apex
      const t = s;
      centerPos.x = lerp(fc.x, ac.x, t);
      centerPos.y = lerp(fc.y, ac.y, t);
      centerPos.z = lerp(fc.z, ac.z, t);
    } else {
      // Transition from Small Stellated Dodecahedron Apex back to Great Dodecahedron Center
      const t = s - 1.0;
      centerPos.x = lerp(ac.x, fc.x, t);
      centerPos.y = lerp(ac.y, fc.y, t);
      centerPos.z = lerp(ac.z, fc.z, t);
    }

    // Write center vertex to position buffer
    const centerIdx = 6 * k + 5;
    positions[centerIdx * 3] = centerPos.x;
    positions[centerIdx * 3 + 1] = centerPos.y;
    positions[centerIdx * 3 + 2] = centerPos.z;

    // Determine outer vertices positions V_k,i
    for (let i = 0; i < 5; i++) {
      const vIndex = face.indices[i] ?? 0;
      const baseV = dodecahedronVertices[vIndex] ?? { x: 0, y: 0, z: 0 };
      const adjFaceIdx = adj[i] ?? 0;
      const adjFace = facesData[adjFaceIdx] ?? { indices: [], center: { x: 0, y: 0, z: 0 }, normal: { x: 0, y: 0, z: 0 } };
      const adjNormal = adjFace.normal;
      
      // Apex of adjacent face
      const adjApex = {
        x: adjNormal.x * apexDistance,
        y: adjNormal.y * apexDistance,
        z: adjNormal.z * apexDistance
      };

      let outerPos = { x: 0, y: 0, z: 0 };
      if (s <= 1.0) {
        // Outer vertices remain at the base dodecahedron positions
        outerPos.x = baseV.x;
        outerPos.y = baseV.y;
        outerPos.z = baseV.z;
      } else {
        // Transition from Base Dodecahedron vertices to Adjacent Apexes (forming intersecting Great Dodecahedron)
        const t = s - 1.0;
        outerPos.x = lerp(baseV.x, adjApex.x, t);
        outerPos.y = lerp(baseV.y, adjApex.y, t);
        outerPos.z = lerp(baseV.z, adjApex.z, t);
      }

      // Write outer vertex to position buffer
      const outerIdx = 6 * k + i;
      positions[outerIdx * 3] = outerPos.x;
      positions[outerIdx * 3 + 1] = outerPos.y;
      positions[outerIdx * 3 + 2] = outerPos.z;
    }
  }

  // 12 faces * 5 triangles/face = 60 triangles = 180 indices
  const indices = new Uint16Array(60 * 3);
  let triIdx = 0;
  for (let k = 0; k < 12; k++) {
    const c = 6 * k + 5; // center vertex index
    for (let i = 0; i < 5; i++) {
      const v0 = 6 * k + i;
      const v1 = 6 * k + ((i + 1) % 5);
      
      indices[triIdx * 3] = c;
      indices[triIdx * 3 + 1] = v0;
      indices[triIdx * 3 + 2] = v1;
      triIdx++;
    }
  }

  return { positions, indices };
}
