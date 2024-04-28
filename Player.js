import * as THREE from 'three';

class Player {
    constructor(scene) {
        this.object = new THREE.Mesh(new THREE.SphereGeometry(0.7), new THREE.MeshBasicMaterial({ color: 0xfa932d }));
        this.object.position.y = 30
        scene.add(this.object);
        this.yVelocity = 0;
        this.time = 0;
    };
    applyGravity() {

        if (this.time == 0) {
            this.time = performance.now();
        } else {
            let elapsedTime = performance.now() - this.time;
            this.time = performance.now();

            if (this.yVelocity > -1) {
                this.yVelocity -= 0.0002 * elapsedTime
            }
            this.object.position.y += this.yVelocity * elapsedTime
        }
        if (this.object.position.y < 0) {
            this.object.position.y = 0
            this.yVelocity = 0
        } else if (this.object.position.y > 20) {
            this.object.position.y = 20
            this.yVelocity = 0
        }

    }
    applyJump() {
        this.yVelocity = 0.06;
    }
    removeFromScene(scene) {
        scene.remove(this.object)
    }
}

export { Player };