# Dodecahedron Stellation Visualization Specification

## Overview
This project visualizes the stellations of a regular dodecahedron using Vue 3, Vite, and TresJS. A regular dodecahedron has 12 pentagonal faces, and stellating it means extending these face planes outward until they intersect to form new polyhedra.

## Architecture

### 3D Viewport Component
- Use TresJS with `<TresCanvas>` for 3D rendering
- Import `<OrbitControls />` from `@tresjs/cientos` for mouse interaction (spinning, resizing, zooming)
- Add proper scene lighting with ambient and directional lights
- Implement a mesh component to display the dodecahedron

### Mathematical Logic
- Create a `dodecahedron.ts` file that defines or calculates:
  - Base Regular Dodecahedron (12 pentagonal faces)
  - First Stellation (Small Stellated Dodecahedron - 12 pentagrammic faces)
  - Second Stellation (Great Dodecahedron)
- Implement interpolation logic between stellations for smooth transitions

### UI Component
- Create a slider/stepper component that transitions between stellation states
- Demonstrate how extending face planes generates each subsequent model
- Include labels for Base, First Stellation, and Second Stellation

### Styling
- Use clean, responsive CSS
- Ensure proper layout and visual design
- Make components responsive to different screen sizes

## Requirements
1. Vue 3 with Composition API
2. Vite for build tooling
3. TresJS for 3D rendering
4. Three.js for underlying 3D operations
5. Responsive design principles
6. Smooth transitions between stellation states
