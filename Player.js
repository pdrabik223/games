import * as THREE from 'three';

class Player {
    constructor(scene) {
        this.object = new THREE.Mesh(new THREE.SphereGeometry(0.7), new THREE.MeshBasicMaterial({ color: 0xfa932d }));
        this.object.position.y = 30
        scene.add(this.object);
        this.framesFalling = 0;
        this.framesSincePress = 0;
        this.yVelocity = 0;
    };
    applyGravity() {
        this.framesSincePress += 1
        if (this.yVelocity > -1) {
            this.yVelocity -= 0.05 * (this.framesFalling / 20)
            this.framesFalling += 1
        }

        this.object.position.y += this.yVelocity
        if (this.object.position.y < 0) {
            this.object.position.y = 0
            this.yVelocity = 0
            this.framesFalling = 0
        }else if (this.object.position.y > 20) {
            this.object.position.y = 20
            this.yVelocity = 0
            this.framesFalling = 0
        }


    }
    applyJump() {

        if (this.framesSincePress > 10) {
            this.framesSincePress = 0;
            this.framesFalling = 0;
            this.yVelocity = 0.6;
        }
    }
    removeFromScene(scene) {
        scene.remove(this.object)
    }
}

export { Player };