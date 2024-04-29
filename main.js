import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Player } from "./Player.js";
import { Obstacle, ObstacleState } from "./Obstacle.js";
import { randyEngine } from './engines/Randy.js';
import { smartPants } from './engines/SmartPants.js';
import { Matrix, DeepNet, GenNetEngine } from "./engines/GenNet.js"

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




function handleObstacles() {
	if (obstaclesInView.length == 0) {
		obstaclesInView.push(new Obstacle(scene));
	} else {
		let number_of_incoming = 0

		for (let i = 0; i < obstaclesInView.length; i++) {
			if (obstaclesInView[i].applyShift()) {

				for (let p = 0; p < players.length; p++) {
					players[p].addPoint();
				}

			}

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

// document.addEventListener('keydown', function (event) {
// 	switch (event.key) {
// 		case ' ':
// 			players[0].applyJump()
// 			break;

// 	}
// });

function animateObjects() {

	handleObstacles();
	for (let i = 0; i < players.length; i++) {
		players[i].applyGravity();

	}
}
function abs(val) {
	if (val < 0) return -val;
	return val;

}

function getObstacleInRange(range, changeColor = false) {
	// range from 0 
	for (let i = 0; i < obstaclesInView.length; i++) {
		if (abs(obstaclesInView[i].positionX) - range < 0) {

			if (changeColor)
				obstaclesInView[i].changeColor(0xff3030)
			return i;
		} else {
			if (changeColor)
				obstaclesInView[i].changeColor(0x30ff30)
		}
	}
	return null
}
function getNextObstacle(changeColor = false) {
	// range from 0 
	for (let i = 0; i < obstaclesInView.length; i++) {
		if (obstaclesInView[i].state != ObstacleState.Cleared) {
			if (changeColor)
				obstaclesInView[i].changeColor(0xff3030)
			return i;
		} else {
			if (changeColor)
				obstaclesInView[i].changeColor(0x30ff30)
		}
	}
	return null
}

function calculateCollision() {
	// let obstaclePositionX = null;
	let collisionObstacleId = getObstacleInRange(0.5 + 0.7);

	if (collisionObstacleId == null) {
		return
	}
	// let obstaclePositionX = obstaclesInView[collisionObstacleId].positionX
	let obstaclePositionY = obstaclesInView[collisionObstacleId].positionY
	for (let i = 0; i < players.length; i++) {
		if (obstaclePositionY + 5 > players[i].object.position.y - 0.7) {
			players[i].kill()
			obstaclesInView[collisionObstacleId].changeColor(0xff3030)
		}
		if (obstaclePositionY + 5 + 10 < players[i].object.position.y + 0.7) {
			players[i].kill()
			obstaclesInView[collisionObstacleId].changeColor(0xff3030)
		}
	}

}

var engines, frames, prevTime, players = [], obstaclesInView = [], gameIteration = 0, prevBestPlayer = 0, prevBestPoints = -1
function resetGame(noPlayers) {
	// if (prevBestPlayer != null) {

	for (let p = 0; p < players.length; p++) {
		if (players[p].points > prevBestPoints) {
			prevBestPlayer = p;
			prevBestPoints = players[p].points
		}
	}
	// }
	for (let p = 0; p < players.length; p++) {
		players[p].removeFromScene(scene)
	}
	players = []
	for (let o = 0; o < obstaclesInView.length; o++) {
		obstaclesInView[o].removeFromScene(scene)
	}
	obstaclesInView = []

	gameIteration += 1
	frames = 0;
	prevTime = performance.now();

	for (let p = 0; p < noPlayers; p++) {
		players.push(new Player(scene, p))
	}

	if (prevBestPoints == -1) {
		engines = []
		for (let p = 0; p < noPlayers; p++) {
			engines.push(new GenNetEngine())
		}
	} else {
		let prevBestEngine = engines[prevBestPlayer]
		for (let p = 0; p < noPlayers; p++) {
			if (p != prevBestEngine) {
				// engines[p] = prevBestEngine
				engines[p] = GenNetEngine.fromExisting(prevBestEngine, 12)

			}
		}

	}

}

function animate() {
	var noAlivePlayers = 0;
	for (let p = 0; p < players.length; p++) {
		if (!players[p].isDead) { noAlivePlayers += 1; }
	}
	if (noAlivePlayers == 0) {
		resetGame(40);
	}
	const time = performance.now();

	requestAnimationFrame(animate);
	// controls.update();
	animateObjects();
	calculateCollision();
	// if (randyEngine()) {
	// 	players[1].applyJump();
	// }
	for (let p = 0; p < players.length; p++) {
		let collisionObstacleId = getNextObstacle(true);

		if (!players[p].isDead) {

			if (engines[p].getDecision(players[p].object.position.y,
				players[p].yVelocity,
				obstaclesInView[collisionObstacleId].positionY,
				obstaclesInView[collisionObstacleId].positionX)) { players[p].applyJump(); }
		}
	}

	renderer.render(scene, camera);

	frames++;
	if (time >= prevTime + 1000) {
		let scoreboard = "";
		for (let i = 0; i < players.length; i++) {
			scoreboard += " " + players[i].getName() + ": " + players[i].points
		}

		document.getElementById("info").innerHTML = "fps: " + Math.round((frames * 1000) / (time - prevTime)) + scoreboard + " Iteration: " + gameIteration
		frames = 0;
		prevTime = time;
	}

}

animate();