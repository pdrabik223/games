import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


class Player {
	constructor(scene, key) {
		this.object = new THREE.Mesh(new THREE.SphereGeometry(0.7), new THREE.MeshBasicMaterial({ color: 0xff3030 }));
		this.object.position.y = 30
		scene.add(this.object);
		this.framesFalling = 0;
		this.framesSincePress = 0;
		this.yVelocity = 0;
	};
	applyGravity() {
		player.framesSincePress += 1
		if (this.yVelocity > -1) {
			this.yVelocity -= 0.05 * (this.framesFalling / 20)
			this.framesFalling += 1
		}

		this.object.position.y += this.yVelocity
		if (this.object.position.y < 0) {
			this.object.position.y = 0
			this.yVelocity = 0
			this.framesFalling = 0
		}
	}
	removeFromScene(scene) {
		scene.remove(this.object)
	}
}

class Obstacle {
	constructor(scene) {
		this.object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff3030 }));
		this.object.position.x = 25
		scene.add(this.object);
	}
	applyShift() {

		this.object.position.x -= 0.06
	}
	removeFromScene(scene) {
		scene.remove(this.object)

	}
}

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
scene.add(flor);
flor.position.y = -0.5



const player = new Player(scene, 32);
const obstaclesInView = []


function handleObstacles() {
	if (obstaclesInView.length == 0) {
		obstaclesInView.push(new Obstacle(scene));
	} else {

		obstaclesInView[0].applyShift()
	}

	if (obstaclesInView[0].object.position.x <= -25) {
		obstaclesInView[0].removeFromScene(scene);
		obstaclesInView.shift()
	}

}


document.addEventListener('keydown', function (event) {
	switch (event.key) {
		case ' ':
			if (player.framesSincePress > 10) {
				player.framesSincePress = 0;
				player.framesFalling = 0;
				player.yVelocity = 0.6;
			}
			break;
	}
});

let frames = 0, prevTime = performance.now();

function animate() {
	requestAnimationFrame(animate);
	controls.update();

	handleObstacles();
	player.applyGravity();

	frames++;
	const time = performance.now();
	if (time >= prevTime + 1000) {

		document.getElementById("info").innerHTML = "fps: " + Math.round((frames * 1000) / (time - prevTime))
		frames = 0;
		prevTime = time;

	}

	renderer.render(scene, camera);
}

animate();