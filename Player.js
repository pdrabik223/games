import * as THREE from 'three';


const colorNameMapping = [
    ["orange", 0xfa93d],
    ["green", 0xfa93d],
    ["pink", 0xdf2ffa],
    ["blue", 0x2f44fa],
    ["cyan", 0x2ff0fa],
    ["red", 0xfa3011],
    ['yellow', 0xfa3011]

]

class Player {
    constructor(scene, playerId) {
        this.object = new THREE.Mesh(new THREE.SphereGeometry(0.7), new THREE.MeshBasicMaterial({ color: colorNameMapping[playerId][1] }));
        this.object.position.y = 30
        scene.add(this.object);
        this.yVelocity = 0;
        this.timeOfLastFrame = 0;
        this.timeOfLastJump = -100;
        this.points = 0;
        this.playerId = playerId
        this.isDead = false
    };
    getName() {
        return colorNameMapping[this.playerId][0]
    }
    addPoint() {
        if (!this.isDead) {
            this.points += 1;
        }
    }
    applyGravity() {

        if (this.timeOfLastFrame == 0) {
            this.timeOfLastFrame = performance.now();
        } else {
            let elapsedTime = performance.now() - this.timeOfLastFrame;
            this.timeOfLastFrame = performance.now();

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
    kill() {
        this.isDead = true;
    }
    applyJump() {
        if (this.isDead) { return }
        let elapsedTime = performance.now() - this.timeOfLastJump;
        if (elapsedTime > 10) {
            this.timeOfLastJump = performance.now();
            this.yVelocity = 0.06;
        }

    }
    removeFromScene(scene) {
        scene.remove(this.object)
    }
}

export { Player };