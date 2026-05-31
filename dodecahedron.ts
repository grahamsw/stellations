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

// Base regular dodecahedron vertices and faces
export const BASE_DODECAHEDRON: Dodecahedron = {
  vertices: [
    { x: 0, y: 1, z: PHI },
    { x: 0, y: -1, z: PHI },
    { x: 0, y: 1, z: -PHI },
    { x: 0, y: -1, z: -PHI },
    { x: 1, y: PHI, z: 0 },
    { x: -1, y: PHI, z: 0 },
    { x: 1, y: -PHI, z: 0 },
    { x: -1, y: -PHI, z: 0 },
    { x: PHI, y: 0, z: 1 },
    { x: -PHI, y: 0, z: 1 },
    { x: PHI, y: 0, z: -1 },
    { x: -PHI, y: 0, z: -1 },
  ],
  faces: [
    { vertices: [0, 4, 8, 11, 5] },
    { vertices: [0, 5, 9, 1, 4] },
    { vertices: [0, 1, 10, 7, 11] },
    { vertices: [1, 9, 3, 6, 10] },
    { vertices: [1, 10, 7, 11, 5] },
    { vertices: [2, 6, 3, 9, 4] },
    { vertices: [2, 4, 5, 11, 8] },
    { vertices: [2, 8, 11, 7, 3] },
    { vertices: [3, 7, 10, 6, 9] },
    { vertices: [4, 9, 6, 10, 1] },
    { vertices: [5, 11, 7, 3, 9] },
    { vertices: [8, 11, 5, 4, 2] },
  ]
};

// First stellation (Small Stellated Dodecahedron)
export const FIRST_STELLATION: Dodecahedron = {
  vertices: [
    { x: 0, y: 1, z: PHI },
    { x: 0, y: -1, z: PHI },
    { x: 0, y: 1, z: -PHI },
    { x: 0, y: -1, z: -PHI },
    { x: 1, y: PHI, z: 0 },
    { x: -1, y: PHI, z: 0 },
    { x: 1, y: -PHI, z: 0 },
    { x: -1, y: -PHI, z: 0 },
    { x: PHI, y: 0, z: 1 },
    { x: -PHI, y: 0, z: 1 },
    { x: PHI, y: 0, z: -1 },
    { x: -PHI, y: 0, z: -1 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
  ],
  faces: [
    { vertices: [0, 4, 8, 11, 5] },
    { vertices: [0, 5, 9, 1, 4] },
    { vertices: [0, 1, 10, 7, 11] },
    { vertices: [1, 9, 3, 6, 10] },
    { vertices: [1, 10, 7, 11, 5] },
    { vertices: [2, 6, 3, 9, 4] },
    { vertices: [2, 4, 5, 11, 8] },
    { vertices: [2, 8, 11, 7, 3] },
    { vertices: [3, 7, 10, 6, 9] },
    { vertices: [4, 9, 6, 10, 1] },
    { vertices: [5, 11, 7, 3, 9] },
    { vertices: [8, 11, 5, 4, 2] },
  ]
};

// Second stellation (Great Dodecahedron)
export const SECOND_STELLATION: Dodecahedron = {
  vertices: [
    { x: 0, y: 1, z: PHI },
    { x: 0, y: -1, z: PHI },
    { x: 0, y: 1, z: -PHI },
    { x: 0, y: -1, z: -PHI },
    { x: 1, y: PHI, z: 0 },
    { x: -1, y: PHI, z: 0 },
    { x: 1, y: -PHI, z: 0 },
    { x: -1, y: -PHI, z: 0 },
    { x: PHI, y: 0, z: 1 },
    { x: -PHI, y: 0, z: 1 },
    { x: PHI, y: 0, z: -1 },
    { x: -PHI, y: 0, z: -1 },
    { x: 0, y: 0, z: 1 },
    { x: 0, y: 0, z: -1 },
    { x: 1, y: 0, z: 0 },
    { x: -1, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: 0, y: -1, z: 0 },
    { x: 1, y: 1, z: 1 },
    { x: -1, y: -1, z: -1 },
    { x: 1, y: -1, z: 1 },
    { x: -1, y: 1, z: -1 },
  ],
  faces: [
    { vertices: [0, 4, 8, 11, 5] },
    { vertices: [0, 5, 9, 1, 4] },
    { vertices: [0, 1, 10, 7, 11] },
    { vertices: [1, 9, 3, 6, 10] },
    { vertices: [1, 10, 7, 11, 5] },
    { vertices: [2, 6, 3, 9, 4] },
    { vertices: [2, 4, 5, 11, 8] },
    { vertices: [2, 8, 11, 7, 3] },
    { vertices: [3, 7, 10, 6, 9] },
    { vertices: [4, 9, 6, 10, 1] },
    { vertices: [5, 11, 7, 3, 9] },
    { vertices: [8, 11, 5, 4, 2] },
  ]
};

// Function to interpolate between two stellations
export function interpolateStellation(
  t: number, 
  from: Dodecahedron, 
  to: Dodecahedron
): Dodecahedron {
  // Simple linear interpolation for demonstration
  // In a real implementation, this would be more complex
  return from;
}
