
// Libraries
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { BoxGeometry } from 'https://cdn.skypack.dev/three/src/geometries/BoxGeometry.js';

// Always need 3 things: Scene, Camera, Renderer

// Scene container that holds everything
const scene = new THREE.Scene();
// Perspective camera, essentially an fps camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const cameraStartingZPosition = 20;
camera.position.setZ(0);
camera.position.setY(cameraStartingZPosition);

// renderer: renders out graphics to the scene
const renderer = new THREE.WebGL1Renderer({
  // canvas html tag with an id of 'bg'
  canvas: document.querySelector('#c'),
});
// set pixel ratio for current device
renderer.setPixelRatio(window.devicePixelRatio);
//makes a full screen canvas
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1B2631, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.antialias = true;

// Loaders
const textureLoader = new THREE.TextureLoader();

const gltfLoader = new GLTFLoader();
gltfLoader.path = 'models/'

//*********************** */
//*********************** */
// ****** Objects ******* //
//*********************** */
//*********************** */

function front_box_material(front) {
  return [
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load(front) }),
    new THREE.MeshBasicMaterial({ color: 0x000000 }),
  ]
}

// joe box object
const joeTexture = textureLoader.load('images/joe.jpg');
const joe = new THREE.Mesh(
  new THREE.BoxGeometry(4, 4, 0.5),
  front_box_material('images/joe.jpg')
)
joe.position.set(5, 20, -6);
joe.rotation.y -= 0.5;
scene.add(joe);

// keeb object
const keeb = new THREE.Mesh(
  new THREE.BoxGeometry(18, 7, 0.2),
  front_box_material('images/laser.png')
)
keeb.scale.set(0.25, 0.25, 1)
keeb.position.set(5, 11.5, -6);
keeb.rotation.x -= 0.5;
keeb.rotation.y -= 0.5;
scene.add(keeb);

// Strike Gundam object
var gundam;
const model_glass_case_position = [4.5,5.5,-6]
gltfLoader.load('strike_gundam_posed.glb', function (gltf) {
  const model = gltf.scene;
  model.traverse(function (node) {
    if (node.isMesh) { node.castShadow = true; }
  });
  scene.add(model)
  // 4.5, 4.8, -6
  model.position.set(
    0 + model_glass_case_position[0], 
    0 + model_glass_case_position[1], 
    0 + model_glass_case_position[2]
  );
  model.rotation.y -= 0.5;
  model.scale.set(1.1, 1.1, 1.1);

  //Gundam Lighting
  const gundam_pos = model.position;

  //4 overhead lights
  four_square_lights(
    gundam_pos.x-2, 
    gundam_pos.y+4, 
    gundam_pos.z-2, 
    3.5, 
    model
  );
  //1 light below gundam
  const belowlight = new THREE.DirectionalLight(0xffffff, 5);
  belowlight.position.set(
    gundam_pos.x,
    gundam_pos.y-1,
    gundam_pos.z
    );
  console.log("belowlight position at " + gundam_pos )
  belowlight.target = model;
  scene.add(belowlight);
  if(show_helpers) {
    const belowlightHelper = new THREE.PointLightHelper(belowlight);
    scene.add(belowlightHelper);
  }
  // allow model variables to be used outside of callback function
  gundam = model;
});

// Gundam glass case
const glassCase = new THREE.Mesh(
  new THREE.BoxGeometry(3.3, 3, 3.3),
  new THREE.MeshBasicMaterial({
    color: 0x02D9DA,
    opacity: .1,
    transparent: true
  })
)
glassCase.position.set(
  0 + model_glass_case_position[0], 
  1 + model_glass_case_position[1], 
  0 + model_glass_case_position[2]
);
glassCase.receiveShadow = true;
scene.add(glassCase);

// Gundam glass case base
const caseBase = new THREE.Mesh(
  new THREE.BoxGeometry(3.4, .6, 3.4),
  new THREE.MeshPhongMaterial({
    color: 0x696969,
    map: textureLoader.load('images/carbonfiber.jpg')
  })
)
caseBase.position.set(
  0 + model_glass_case_position[0], 
  -.3 + model_glass_case_position[1],
  0 + model_glass_case_position[2]
  );
caseBase.receiveShadow = true;
scene.add(caseBase);

var phone;
gltfLoader.load('phone.glb', function(gltf) {
  var model = gltf.scene;
  var scl = 20
  model.scale.set(scl, scl, scl)
  model.rotation.x = 1.4;
  model.rotation.y = 0;
  model.rotation.z = .9;
  model.position.set(5,1.6,-6)
  scene.add(model);
  phone = model;
});

var pnnlLogo = new THREE.Mesh(
  new BoxGeometry(2.5,2.5,.2),
  front_box_material('images/pnnl.png')
)
pnnlLogo.position.set(5, -4, -6)
pnnlLogo.rotation.y -= 0.5
scene.add(pnnlLogo)

var chicoState = new THREE.Mesh(
  new BoxGeometry(3,3,.2),
  front_box_material('images/chicostate.jpg')
)
chicoState.position.set(5, -10, -6)
chicoState.rotation.y -= 0.5
scene.add(chicoState)

var grad = new THREE.Mesh(
  new BoxGeometry(3,4.2,.2),
  front_box_material('images/grad.jpg')
)
grad.position.set(5, -18.5, -6)
grad.rotation.y -= 0.5
scene.add(grad)

//*************************** */
//*************************** */
// ******** Lighting ******** // 
//*************************** */
//*************************** */

function four_square_lights(start_x, start_y, start_z, space, object_to_point_at) {
  var x = start_x; var y = start_y; var z = start_z;
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
      const light = new THREE.DirectionalLight(0xffffff, 2.5);
      light.position.set(x, y, z);
      console.log("light position at " + x + " " + y + " " + z )
      light.target = object_to_point_at;
      light.castShadow = true;
      scene.add(light);
      if(show_helpers) {
        const lightHelper = new THREE.PointLightHelper(light);
        scene.add(lightHelper);
      }
      x += space;
    }
    x = start_x;
    z += space;
  }
}

//************************ */
//************************ */
//******** Helpers ******* /
//************************ */
//************************ */
var show_helpers = false;
if (show_helpers) {
  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(gridHelper);
}

//********************************************** */
//********************************************** */
//******** Animations / Camera Movement ******** */
//********************************************** */
//********************************************** */

function hover_animation(object) {
  object.rotation.y = Math.sin(Date.now() * 0.0005) * Math.PI * 0.05 - 0.5;
  object.position.y += Math.sin(Date.now() * 0.001) * Math.PI * 0.0003;
}
function rotate_animation(object) {
  object.rotation.y += 0.001;
}
// render loop
function animate() {
  // Since loading the models are asynchronous, there is no gaurantee that the model will be completely loaded in 
  // and assigned to its respective variable at the first animation loop, so we need to first check if it exists
  // before we attempt to do any animating on it
  requestAnimationFrame(animate);
  if(joe) { hover_animation(joe) }
  if(keeb) { hover_animation(keeb) }
  if(glassCase) { hover_animation(glassCase) }
  if(caseBase) { hover_animation(caseBase) }
  if(gundam) { hover_animation(gundam) }
  if(phone) { hover_animation(phone)}
  if(pnnlLogo) { hover_animation(pnnlLogo)}
  if(chicoState) { hover_animation(chicoState)}
  if(grad) { hover_animation(grad)}
  renderer.render(scene, camera);
}
animate();

//********************************* */
//********************************* */
//******** Event Listeners ******** */
//********************************* */
//********************************* */

// window resize
window.addEventListener('resize', on_window_resize, false);
function on_window_resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Mousewheel event
function scrollCamera(event) {
  camera.position.y = cameraStartingZPosition - window.scrollY / 100.0;
}
window.addEventListener('scroll', scrollCamera)

