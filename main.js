import './style.css'

// Libraries
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'


// Always need 3 things: Scene, Camera, Renderer

// Scene container that holds everything
const scene = new THREE.Scene();
// Perspective camera, essentially an fps camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const cameraStartingZPosition = 20;
camera.position.setZ(0);
camera.position.setY(cameraStartingZPosition);

// renderer: renders out graphics to the scene
const renderer = new THREE.WebGL1Renderer({
  // canvas tag with an id of 'bg'
  canvas: document.querySelector('#c'),
});
// set pixel ratio for current device
renderer.setPixelRatio( window.devicePixelRatio);
//makes a full screen canvas
renderer.setSize(window.innerWidth, window.innerHeight);

// Loaders
const textureLoader = new THREE.TextureLoader();
const fontLoader = new FontLoader();


// *** Objects/Meshes *** //
const spaceTexture = new THREE.TextureLoader().load('images/space.jpg');
scene.background = spaceTexture;

// joe box object
const joeTexture = textureLoader.load('images/joe.jpg');
const joe = new THREE.Mesh(
  new THREE.BoxGeometry(5,5,0.5),
  new THREE.MeshBasicMaterial( {map: joeTexture } )
)
joe.position.set(5,20,-7);
joe.rotation.y -= 0.5;
scene.add(joe);

// triangle object
const tri = new THREE.Mesh(
  new THREE.ConeGeometry(20,20,20,100),
  new THREE.MeshStandardMaterial( {color: 0x00ff00} )
)
scene.add(tri)
tri.position.set(0,10,-50)


// Lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,-20,-50);
scene.add(pointLight);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);



// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// Animations/Camera Movement
// render loop
function animate(){
  requestAnimationFrame(animate);
  joe.rotation.y = Math.sin(Date.now() * 0.001) * Math.PI * 0.05 - 0.5;
  joe.position.y += Math.sin(Date.now() * 0.001) * Math.PI * 0.0005;
  renderer.render(scene,camera);
}
animate();

// window resize
window.addEventListener('resize', on_window_resize, false);
function on_window_resize(){
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// Mousewheel event
function scrollCamera(event) {
  camera.position.y = cameraStartingZPosition - window.scrollY / 100.0;
}
window.addEventListener('scroll', scrollCamera)

