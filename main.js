
// Libraries
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';
import { BoxGeometry } from 'https://unpkg.com/three/src/geometries/BoxGeometry.js';

// Loaders
const textureLoader = new THREE.TextureLoader();

function main() {
	const canvas = document.querySelector('#c');
	const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
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

	// // Portrait model scene
	// function setupSceneJoe() {
	// 	const texture = textureLoader.load('images/joe.jpg')
	// 	const sceneInfo = makeScene(document.querySelector('#joe-portrait'));
	// 	const geometry = new THREE.BoxGeometry(2, 2, 2);
	// 	const material = new THREE.MeshPhongMaterial({ map: texture });
	// 	const mesh = new THREE.Mesh(geometry, material);
	// 	sceneInfo.scene.add(mesh);
	// 	sceneInfo.mesh = mesh;
	// 	return sceneInfo;
	// }

	// Project models scene
	function setupSceneProjects() {
		const sceneInfo = makeScene(document.querySelector('#project-models'));
		const geometry = new THREE.BoxGeometry(1, 1, 0.125);
		const material = new THREE.MeshPhongMaterial({ color: 'red' });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0,1.3,0)
		sceneInfo.scene.add(mesh);
		sceneInfo.mesh = mesh;

		const geometry2 = new THREE.BoxGeometry(1, 1, 0.125);
		const material2 = new THREE.MeshPhongMaterial({ color: 'red' });
		const mesh2 = new THREE.Mesh(geometry2, material2);
		mesh2.position.set(0,-0.2,0)
		sceneInfo.scene.add(mesh2);
		sceneInfo.mesh = mesh2;

		return sceneInfo;
	}

	// Work History models scene
	function setupSceneWorkHistory() {
		const sceneInfo = makeScene(document.querySelector('#work-history-models'));
		const geometry = new THREE.BoxGeometry(1, 1, 0.125);
		const material = new THREE.MeshPhongMaterial({ color: 'red' });
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0,1.3,0)
		sceneInfo.scene.add(mesh);
		sceneInfo.mesh = mesh;

		const geometry2 = new THREE.BoxGeometry(1, 1, 0.125);
		const material2 = new THREE.MeshPhongMaterial({ color: 'red' });
		const mesh2 = new THREE.Mesh(geometry2, material2);
		mesh2.position.set(0,-.8,0)
		mesh2.rotation.x = -0.1;
		sceneInfo.scene.add(mesh2);
		sceneInfo.mesh = mesh2;

		return sceneInfo;
	}

	// Education models scene
	// function setupSceneEducation() {
	// 	const sceneInfo = makeScene(document.querySelector('#education-models'));
	// 	const geometry = new THREE.BoxGeometry(3, 3, 0.125);
	// 	const material = new THREE.MeshPhongMaterial({ color: 'red' });
	// 	const mesh = new THREE.Mesh(geometry, material);
	// 	sceneInfo.scene.add(mesh);
	// 	sceneInfo.mesh = mesh;
	// 	return sceneInfo;
	// }

	// const sceneInfoJoe = setupSceneJoe();
	const sceneInfoProjects = setupSceneProjects();
	const sceneInfoWorkHistory = setupSceneWorkHistory();
	// const sceneInfoEducation = setupSceneEducation();

	// *************************************
	// ******** Rendering/Animation ********
	// *************************************
	function hover_animation(object) {
		object.rotation.y = Math.sin(Date.now() * 0.0005) * Math.PI * 0.02;
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
		//Render scenes
		// renderSceneInfo(sceneInfoJoe);
		// hover_animation(sceneInfoJoe.mesh);

		renderSceneInfo(sceneInfoProjects);
		// console.log(sceneInfoProjects.scene.children)
		hover_animation(sceneInfoProjects.scene.children[1]);
		hover_animation(sceneInfoProjects.scene.children[2]);

		renderSceneInfo(sceneInfoWorkHistory);
		// console.log(sceneInfoWorkHistory.scene.children)
		hover_animation(sceneInfoWorkHistory.scene.children[1]);
		hover_animation(sceneInfoWorkHistory.scene.children[2]);

		// renderSceneInfo(sceneInfoEducation);
		// hover_animation(sceneInfoEducation.mesh);

		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);

}

main();
