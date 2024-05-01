import * as THREE from 'three';
import gameConfig from './config.json' with { type: 'json' };



function getRandomFloat(min, max) {
    return min + Math.random() * (max - min);
}

function degToRad(deg) {
    return deg * Math.PI / 180
}

const ObstacleState = {
    Incoming: "Incoming",
    Warning: "Warning",
    Cleared: "Cleared"

}

class Obstacle {
    constructor(scene) {
        this.width = getRandomFloat(2, 6)
        this.height = getRandomFloat(2, 6)

        this.positionX = gameConfig["levelWidth"] / 2
        this.positionY = getRandomFloat(0, gameConfig["levelHeight"] - 5)

        this.objects = []
        this.time = 0
        this.objects[0] = new THREE.Mesh(new THREE.BoxGeometry(this.width, this.height, gameConfig["levelDepth"]), new THREE.MeshBasicMaterial({ color: 0x30ff30 }));
        this.objects[0].position.x = this.positionX
        this.objects[0].position.y = this.positionY
        // this.addSecondBar()
        // this.addRotation()

        this.state = ObstacleState.Incoming
        for (let i = 0; i < this.objects.length; i++) {
            scene.add(this.objects[i]);
        }

    }

    addRotation() {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].rotateZ(degToRad(getRandomFloat(-25, 25)));
        }
    }


    applyShift() {
        if (this.time == 0) {
            this.time = performance.now();
        } else {
            let elapsedTime = performance.now() - this.time;
            this.time = performance.now();
            this.positionX -= 0.012 * elapsedTime * gameConfig["gameSpeed"];
        }

        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].position.x = this.positionX;
        }

        if (this.positionX < 3 && this.positionX > -3) {
            if (this.state == ObstacleState.Incoming) {
                this.state = ObstacleState.Warning
            }
        } else {
            if (this.state == ObstacleState.Warning) {
                this.state = ObstacleState.Cleared
                return true
            }
        }
        return false
    }
    removeFromScene(scene) {
        for (let i = 0; i < this.objects.length; i++) {
            scene.remove(this.objects[i])
        }

    }
    changeColor(color) {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].material.color.setHex(color);
        }

    }
    calculateCollision(playerX, playerY) {
        // assuming that player is a sphere

        let topLeftCornerX = this.positionX - this.width / 2
        let topLeftCornerY = this.positionY - this.height / 2
        let playerRadius = gameConfig["playerSize"]

        if (playerX + playerRadius >= topLeftCornerX && playerX - playerRadius <= topLeftCornerX + this.width)

            if (playerY + playerRadius >= topLeftCornerY && playerY - playerRadius <= topLeftCornerY + this.height)

                return true

        return false
    }
}

export { Obstacle, ObstacleState };