import * as THREE from 'three';

class Player {
    constructor(scene) {
        this.object = new THREE.Mesh(new THREE.SphereGeometry(0.7), new THREE.MeshBasicMaterial({ color: 0xfa932d }));
        this.object.position.y = 30
        scene.add(this.object);
        this.framesFalling = 0;
        this.framesSincePress = 0;
        this.yVelocity = 0;
        this.time = 0;
    };
    applyGravity() {



        this.framesSincePress += 1
        if (this.yVelocity > -1) {
            this.yVelocity -= 0.001 * (this.framesFalling / 20)
            this.framesFalling += 1
        }

        if (this.time == 0) {
            this.time = performance.now();
        } else {
            let elapsedTime = performance.now() - this.time;
            this.time = performance.now();
            // this.positionX -= 0.012 * elapsedTime;
            this.object.position.y += this.yVelocity * elapsedTime
        }
        if (this.object.position.y < 0) {
            this.object.position.y = 0
            this.yVelocity = 0
            this.framesFalling = 0
        } else if (this.object.position.y > 20) {
            this.object.position.y = 20
            this.yVelocity = 0
            this.framesFalling = 0
        }

    }
    applyJump() {

        if (this.framesSincePress > 10) {
            this.framesSincePress = 0;
            this.framesFalling = 0;
            this.yVelocity = 0.06;
        }
    }
    removeFromScene(scene) {
        scene.remove(this.object)
    }
}

export { Player };