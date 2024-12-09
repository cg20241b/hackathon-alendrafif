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
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Increased ambient light intensity
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 3, 100); // Increased point light intensity for better visibility
pointLight.position.set(0, 3, 3);
scene.add(pointLight);

// Orbit Controls for interactivity
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement

// FontLoader for 3D Text
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
  
  // Alphabet ShaderMaterial for "N" (Plastic-like)
  const alphabetShaderMaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0.2, 0.8, 0.2), // Greenish color for the "N"
    shininess: 50,  // High shininess for plastic
    emissive: new THREE.Color(0, 0, 0), // No glow on "N"
    specular: new THREE.Color(1, 1, 1), // White specular highlight
    flatShading: true,
  });

  // Text Geometry for "N"
  const textGeometry = new TextGeometry('N', {
    font: font,
    size: 1,
    height: 0.5,
  });
  const textMesh = new THREE.Mesh(textGeometry, alphabetShaderMaterial);
  textMesh.position.set(-3, 0, 0); // Left side of the view
  scene.add(textMesh);

  // Digit ShaderMaterial for "7" (Metallic and Reflective)
  const digitShaderMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0.8, 0.1, 0.7), // Purple-ish color
    metalness: 0.95, // Increased metalness for better reflections
    roughness: 0.1, // Lower roughness for smooth reflective surface
    emissive: new THREE.Color(0, 0, 0), // No glow on "7"
    flatShading: true,
  });

  // Text Geometry for "7"
  const digitGeometry = new TextGeometry('7', {
    font: font,
    size: 1,
    height: 0.5,
  });
  const digitMesh = new THREE.Mesh(digitGeometry, digitShaderMaterial);
  digitMesh.position.set(3, 0, 0); // Right side of the view
  scene.add(digitMesh);

  // Glowing Cube (Central Light Source)
  const cubeSize = 0.5;
  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

  // ShaderMaterial for the glowing effect (enhanced glow)
  const glowMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(0xffffff),  // White color for the cube
    emissive: new THREE.Color(0xffffff),  // White emissive glow
    emissiveIntensity: 1.0,  // Strong glow
    roughness: 0.5,  // Smooth surface for glow effect
    metalness: 0.0,  // Non-metallic
    flatShading: true,
  });

  const glowCube = new THREE.Mesh(cubeGeometry, glowMaterial);
  glowCube.position.set(0, 0, 0);
  scene.add(glowCube);

  // Add a Point Light to simulate glowing effect
  const cubeLight = new THREE.PointLight(0xffffff, 5, 10);  // Bright white light with higher intensity
  cubeLight.position.set(0, 0, 0);  // Position it at the cube
  scene.add(cubeLight);

  // Now, make the cube emit light by updating the cubeLight's position
  glowCube.add(cubeLight);  // Attach light to the cube itself

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
