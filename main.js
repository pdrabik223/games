import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Player } from "./Player.js";
import { Obstacle, ObstacleState } from "./Obstacle.js";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const axesHelper = new THREE.AxesHelper(5);

scene.add(camera);
scene.add(axesHelper);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 20, 100);
controls.update();

const flor = new THREE.Mesh(new THREE.BoxGeometry(50, 0.5, 10), new THREE.MeshBasicMaterial({ color: 0x3224f2 }));
flor.position.y = -0.5
const celling = new THREE.Mesh(new THREE.BoxGeometry(50, 0.5, 10), new THREE.MeshBasicMaterial({ color: 0x3224f2 }));
flor.position.y = 20.5

scene.add(celling);
scene.add(flor);

const player = new Player(scene, 32);
let obstaclesInView = []


function handleObstacles() {
	if (obstaclesInView.length == 0) {
		obstaclesInView.push(new Obstacle(scene));
	} else {
		let number_of_incoming = 0

		for (let i = 0; i < obstaclesInView.length; i++) {
			obstaclesInView[i].applyShift()
			if (obstaclesInView[i].state == ObstacleState.Incoming) {
				number_of_incoming += 1
			}
		}
		if (number_of_incoming < 1) {
			obstaclesInView.push(new Obstacle(scene));
		}
	}

	if (obstaclesInView[0].positionX <= -25) {
		obstaclesInView[0].removeFromScene(scene);
		obstaclesInView.shift()
	}

}

document.addEventListener('keydown', function (event) {
	switch (event.key) {
		case ' ':
			player.applyJump()
			break;
	}
});

let frames = 0, prevTime = performance.now();
var noPoints = 0;
function animateObjects() {

	handleObstacles();
	player.applyGravity();

}
function abs(val) {
	if (val < 0) return -val;
	return val;

}
function calculateCollision() {
	let removePoints = false;
	let obstaclePositionX = null;
	let obstaclePositionY = null;
	let playerPositionY = player.object.position.y
	let collisionObstacleId = null;

	for (let i = 0; i < obstaclesInView.length; i++) {

		if (abs(obstaclesInView[i].positionX) - 0.5 - 0.7 < 0) {
			obstaclePositionX = obstaclesInView[i].positionX
			obstaclePositionY = obstaclesInView[i].positionY
			collisionObstacleId = i;
			break;
		} else {
			obstaclesInView[i].changeColor(0x30ff30)
		}
	}

	if (collisionObstacleId == null) {
		return
	}

	if (obstaclePositionY + 5 > playerPositionY - 0.7) {
		removePoints = true;
		obstaclesInView[collisionObstacleId].changeColor(0xff3030)
	}
	if (obstaclePositionY + 5 + 10 < playerPositionY + 0.7) {
		removePoints = true;
		obstaclesInView[collisionObstacleId].changeColor(0xff3030)
	}
	if (removePoints) {
		noPoints = 0;
	}

}
function animate() {

		const time = performance.now();

		requestAnimationFrame(animate);
		// controls.update();
		animateObjects();
		calculateCollision();

		renderer.render(scene, camera);
		
		frames++;
		if (time >= prevTime + 1000) {
			document.getElementById("info").innerHTML = "fps: " + Math.round((frames * 1000) / (time - prevTime)) + "\nPoints: " + noPoints
			frames = 0;
			prevTime = time;
		}
}

animate();