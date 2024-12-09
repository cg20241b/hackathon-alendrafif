import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 10); // Position camera slightly higher

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft ambient light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100); // Point light for realism
pointLight.position.set(0, 3, 3);
scene.add(pointLight);

// Orbit Controls for interactivity
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement

// FontLoader for 3D Text
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
  // Text Material for "A"
  const textMaterial = new THREE.MeshStandardMaterial({ color: 0x2A7E19 }); // Favorite color (Hijau Al-Azhar)
  const textGeometry = new TextGeometry('A', {
    font: font,
    size: 1,
    height: 0.5,
  });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.set(-3, 0, 0); // Left side of the view
  scene.add(textMesh);

  // Text Material for "7"
  const digitMaterial = new THREE.MeshStandardMaterial({ color: 0x6D197E }); // Complementary color (purple-ish kinda thingy)
  const digitGeometry = new TextGeometry('7', {
    font: font,
    size: 1,
    height: 0.5,
  });
  const digitMesh = new THREE.Mesh(digitGeometry, digitMaterial);
  digitMesh.position.set(3, 0, 0); // Right side of the view
  scene.add(digitMesh);

  // Glowing Cube (Central Light Source)
  const cubeSize = 0.5;
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

  // ShaderMaterial for the glowing effect
  const glowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0xffffff) },  // White glow
      intensity: { value: 2},  // Glow intensity
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float intensity;
      varying vec3 vPosition;
      
      void main() {
        float dist = length(vPosition);  // Calculate distance from the center
        gl_FragColor = vec4(glowColor * intensity / (dist * dist), 1.0); // Glow based on distance
      }
    `,
    side: THREE.FrontSide,
    emissive: new THREE.Color(0xffffff),
    flatShading: true,
  });

  const glowCube = new THREE.Mesh(cubeGeometry, glowMaterial);
  glowCube.position.set(0, 0, 0); // Position the cube between the text meshes
  scene.add(glowCube);

  // Add a Point Light to simulate glowing effect
  const cubeLight = new THREE.PointLight(0xffffff, 1, 10);
  cubeLight.position.set(0, 0, 0); // Same position as the cube
  scene.add(cubeLight);

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update camera controls
    renderer.render(scene, camera);
  }

  animate();
});

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
