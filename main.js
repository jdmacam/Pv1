
// Libraries
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
// import { BoxGeometry } from 'https://unpkg.com/three/src/geometries/BoxGeometry.js';
// import { MeshBasicMaterial } from 'three';
// import { CylinderGeometry } from 'three';

// Loaders
const textureLoader = new THREE.TextureLoader();
const gtlfLoader = new GLTFLoader();

function main() {
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true});
	renderer.shadowMap.enabled = true;
	// do not clear output before rendering frame
	renderer.autoClear = false;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	renderer.setSize(width, height, false);


	function makeScene(elem) {
		const scene = new THREE.Scene();

		const fov = 55;
		const aspect = 2;  // the canvas default
		const near = 0.1;
		const far = 5;
		const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		camera.position.set(0, 0.6, 4);
		camera.lookAt(0, 0, 0);

		{
			const color = 0xFFFFFF;
			const intensity = 1;
			const light = new THREE.DirectionalLight(color, intensity);
			light.position.set(-1, 2, 4);
			scene.add(light);
		}

		// return the scene, the camera, and the HTML element the scene will live in
		return { scene, camera, elem };
	}

	// ***********************
	// ******** Scenes ********
	// ***********************

	function frontBoxMaterial(front) {
		return [
			new THREE.MeshBasicMaterial({ color: 0x000000 }),
			new THREE.MeshBasicMaterial({ color: 0x000000 }),
			new THREE.MeshBasicMaterial({ color: 0x000000 }),
			new THREE.MeshBasicMaterial({ color: 0x000000 }),
			new THREE.MeshBasicMaterial({ map: textureLoader.load(front) }),
			new THREE.MeshBasicMaterial({ color: 0x000000 }),
		]
	}


	// Project models scene
	function setupSceneProjects() {
		const sceneInfo = makeScene(document.querySelector('#project-models'));
		
		// Keyboard Object
		const keeb_ratio = 1.2
		const geometryKeeb = new THREE.BoxGeometry(
			1 * keeb_ratio, 
			.39 * keeb_ratio, 
			0.15 * keeb_ratio
		);
		const materialKeeb = frontBoxMaterial('images/laser.png');
		const meshKeeb = new THREE.Mesh(geometryKeeb, materialKeeb);
		meshKeeb.position.set(0,1.1,0)
		meshKeeb.rotation.x = .25;
		sceneInfo.scene.add(meshKeeb);


		// Gundam Object
		var gundam;
		gtlfLoader.load('models/strike_gundam_posed.glb', function (gltf) {
			const model = gltf.scene;
			model.traverse(function (node) {
				if (node.isMesh) { node.castShadow = true; }
			});
			model.scale.set(.5,.5,.5);
			model.position.set(0,-.65,0);
			const gundamPosition = model.position;
			// console.log(model.position);
			sceneInfo.scene.add(model);

			//Gundam Base
			const geometryBase = new THREE.CylinderGeometry(.5,.5,.2,32);
			const materialBase = new THREE.MeshBasicMaterial( { map: textureLoader.load('images/carbonfiber.jpg') });
			const meshBase = new THREE.Mesh(geometryBase, materialBase);
			meshBase.position.set(0, gundamPosition.y - .11, 0);
			meshBase.receiveShadow = true;
			sceneInfo.scene.add(meshBase)

			//Gundam Lights
			const light1 = new THREE.DirectionalLight(0xffffff, 5);
			light1.position.set(
				gundamPosition.x - 0.5,
				gundamPosition.y + 0.5,
				gundamPosition.z - 0.1
			)
			light1.castShadow = true;
			light1.target = model;

			const light2 = new THREE.DirectionalLight(0xffffff, 5);
			light2.position.set(
				gundamPosition.x + 0.5,
				gundamPosition.y + 0.5,
				gundamPosition.z - 0.1
			)
			light2.castShadow = true;
			light2.target = model;
			
			const light3 = new THREE.DirectionalLight(0xffffff, 5);
			light3.position.set(
				gundamPosition.x,
				gundamPosition.y - 0.5,
				gundamPosition.z - 0.1
			)
			light3.castShadow = true;
			light3.target = model;

			sceneInfo.scene.add(light1)
			sceneInfo.scene.add(light2);
			sceneInfo.scene.add(light3);
		});

		return sceneInfo;
	}

	// Work History models scene
	function setupSceneWorkHistory() {
		const sceneInfo = makeScene(document.querySelector('#work-history-models'));
		const geometry = new THREE.BoxGeometry(1, 1, .15);
		const material = frontBoxMaterial('images/pnnl.png');
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0,1.2,0)
		sceneInfo.scene.add(mesh);
		sceneInfo.mesh = mesh;

		const geometry2 = new THREE.BoxGeometry(1, 1, 0.125);
		const material2 = frontBoxMaterial('images/chicostate.jpg');
		const mesh2 = new THREE.Mesh(geometry2, material2);
		mesh2.position.set(0,-.7,0)
		mesh2.rotation.x = -0.1;
		sceneInfo.scene.add(mesh2);
		sceneInfo.mesh = mesh2;

		return sceneInfo;
	}


	const sceneInfoProjects = setupSceneProjects();
	const sceneInfoWorkHistory = setupSceneWorkHistory();

	// *************************************
	// ******** Rendering/Animation ********
	// *************************************
	function hover_animation(object) {
		object.rotation.y = Math.sin(Date.now() * 0.0005) * Math.PI * 0.04;
		object.position.y += Math.sin(Date.now() * 0.001) * Math.PI * 0.0001;
	}

	function rendererToDisplaySize(renderer) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		renderer.setSize(width, height, false);
	}

	function renderSceneInfo(sceneInfo) {
		const { scene, camera, elem } = sceneInfo;
		// get the viewport relative position of this element
		const { left, right, top, bottom, width, height } =
			elem.getBoundingClientRect();
		//  get aspect ratio of the element
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		// addjust the y parameters to be bound within the element
		const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
		renderer.setViewport(left, positiveYUpBottom, width, height);
		renderer.render(scene, camera);
	}

	function render() {
		rendererToDisplaySize(renderer);

		// ***** Render Scenes *****

		// Projects Rendering
		// console.log(sceneInfoProjects.scene.children)
		renderSceneInfo(sceneInfoProjects);
		const keebObj = sceneInfoProjects.scene.children[1];
		const gundamObj = sceneInfoProjects.scene.children[2];
		const gundamBaseObj = sceneInfoProjects.scene.children[3];
		if(keebObj){hover_animation(keebObj);}
		if(gundamObj){hover_animation(gundamObj);}
		if(gundamBaseObj){hover_animation(gundamBaseObj);}

		renderSceneInfo(sceneInfoWorkHistory);
		// console.log(sceneInfoWorkHistory.scene.children)
		hover_animation(sceneInfoWorkHistory.scene.children[1]);
		hover_animation(sceneInfoWorkHistory.scene.children[2]);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);

}

main();
