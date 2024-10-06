import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ambient light
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

// PointLight (for the sun)
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// OrbitControls (360 camera with zoom)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;

// Create Text Sprite Function
function createTextSprite(message, options) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  context.font = options.font || 'Bold 20px Arial';
  context.fillStyle = options.fillStyle || 'rgba(255, 255, 255, 1.0)';
  context.fillText(message, 0, 20);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;

  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(5, 2.5, 1); // Adjust scale as needed
  return sprite;
}

// Function to display data on Earth
function displayDataOnEarth(data, earth) {
  const textOptions = {
    font: 'Bold 20px Arial',
    fillStyle: 'rgba(255, 255, 255, 1.0)',
  };

  if (typeof data === 'object' && data !== null) {
    const entries = Object.entries(data).slice(0, 10); // Limit to 10 entries for display

    entries.forEach(([key, value], index) => {
      const sprite = createTextSprite(`${key}: ${value}`, textOptions);

      // Calculate position based on index
      const radius = 0.4; // Slightly above the surface of Earth
      const angle = (index / entries.length) * Math.PI * 2; // Distribute evenly around the Earth

      // Use trigonometry to place sprites in a circular formation
      sprite.position.set(
        Math.cos(angle) * radius,  // X position
        0.35 + (index * 0.05),      // Y position - above the Earth
        Math.sin(angle) * radius     // Z position
      );

      earth.add(sprite); // Attach the sprite to Earth
    });
  } else {
    console.error('Data is not in the expected format:', data);
  }
}

// Function to create Earth
function createEarth() {
  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const textureLoader = new THREE.TextureLoader();
  const material = new THREE.MeshStandardMaterial({
    map: textureLoader.load('textures/earth.jpg'), // Ensure you have the earth texture
  });

  const earth = new THREE.Mesh(geometry, material);
  scene.add(earth);
  return earth;
}

// Fetch data and display it
fetch('http://localhost:3500/get-csv')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('Data received:', data);
    const earth = createEarth(); // Create Earth first
    displayDataOnEarth(data, earth); // Display data on Earth
  })
  .catch(error => {
    console.error('Error retrieving planet data:', error);
  });

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize the canvas on window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Initial camera position
camera.position.set(0, 5, 20);
