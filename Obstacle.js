import * as THREE from 'three';
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

export {Obstacle};