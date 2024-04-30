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
		let numberOfCleared = 0

		for (let i = 0; i < obstaclesInView.length; i++) {
			if (obstaclesInView[i].applyShift()) {

				for (let p = 0; p < players.length; p++) {
					players[p].addPoint();
				}

			}

			if (obstaclesInView[i].state == ObstacleState.Incoming) {
				numberOfCleared += 1
			}
		}
		if (numberOfCleared < 1) {
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
	let collisionObstacleId = getObstacleInRange(0.5 + 0.7);

	if (collisionObstacleId == null) {
		return
	}
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
function learningRate(noPoints) {
	return 1 / (noPoints * 1.1)

}
var engines, frames, prevTime, players = [], obstaclesInView = [], gameIteration = 0, engineIteration = 0
function resetGame(noPlayers) {

	let bestPlayer = 0;
	let mostPoints = 0;
	let sumPoints = 0;
	prevTime = performance.now();
	frames = 0;
	for (let i = 0; i < players.length; i++) {
		if (players[i].points >= mostPoints) {
			bestPlayer = i;
			mostPoints = players[i].points;
		}
		sumPoints += players[i].points
	}

	for (let p = 0; p < players.length; p++) {
		players[p].removeFromScene(scene)
	}
	players = []
	for (let o = 0; o < obstaclesInView.length; o++) {
		obstaclesInView[o].removeFromScene(scene)
	}
	obstaclesInView = []


	for (let p = 0; p < noPlayers; p++) {
		players.push(new Player(scene, p))
	}

	if (gameIteration == 0 || mostPoints == 0) {
		engines = []
		engineIteration = 0
		for (let p = 0; p < noPlayers; p++) {
			engines.push(new GenNetEngine())
		}
	} else {
		console.log("learning rate: ", learningRate(mostPoints))
		console.log("Best player: ", players[bestPlayer].name, "no points: ", mostPoints)
		console.log("Best net: ", engines[bestPlayer].net.toString())


		engineIteration += 1
		for (let p = 0; p < players.length; p++) {
			if (p != bestPlayer) {
				engines[p] = new GenNetEngine(engines[bestPlayer].net, learningRate(mostPoints))
			}
		}
	}
	gameIteration += 1

}
function normalize(min, max, val) {
	return (val - min) / (max - min)
}
function animate() {
	var noAlivePlayers = 0;
	var mostPoints = 0;
	for (let p = 0; p < players.length; p++) {
		if (!players[p].isDead) { noAlivePlayers += 1; }
		if (players[p].points > mostPoints) mostPoints = players[p].points
	}
	if (noAlivePlayers == 0 || mostPoints > 200) {
		resetGame(120);
	}
	const time = performance.now();

	requestAnimationFrame(animate);
	animateObjects();
	calculateCollision();

	for (let p = 0; p < players.length; p++) {
		let collisionObstacleId = getNextObstacle(true);

		if (!players[p].isDead) {
			if (engines[p].getDecision(
				normalize(0, 20, players[p].object.position.y),
				normalize(-1, 0.6, players[p].yVelocity),
				normalize(-4, 6, obstaclesInView[collisionObstacleId].positionY),
				normalize(-3, 25, obstaclesInView[collisionObstacleId].positionX))) { players[p].applyJump(); }
		}
	}

	renderer.render(scene, camera);

	frames++;
	if (time >= prevTime + 1000) {
		let bestPlayer = 0;
		let alivePlayers = 0;
		for (let i = 1; i < players.length; i++) {
			if (players[i].points > players[bestPlayer].points) {
				bestPlayer = i;
			}
			if (!players[i].isDead) alivePlayers++;
		}
		let scoreboard = " " + players[bestPlayer].getName() + ": " + players[bestPlayer].points

		document.getElementById("info").innerHTML = "fps: " + Math.round((frames * 1000) / (time - prevTime)) + scoreboard + " Iteration: " + gameIteration + " Engine Iteration: " + engineIteration + " Alive players: " + alivePlayers
		frames = 0;
		prevTime = time;
	}

}

animate();