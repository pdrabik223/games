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
        this.width = getRandomFloat(gameConfig["obstacleMinSize"], gameConfig["obstacleMaxSize"])
        this.height = getRandomFloat(gameConfig["obstacleMinSize"], gameConfig["obstacleMaxSize"])

        this.positionX = gameConfig["levelWidth"] / 2
        this.positionY = getRandomFloat(0, gameConfig["levelHeight"] - 5)

        this.time = 0
        this.object = new THREE.Mesh(new THREE.BoxGeometry(this.width, this.height, gameConfig["levelDepth"]), new THREE.MeshBasicMaterial({ color: 0x30ff30 }));
        this.object.position.x = this.positionX
        this.object.position.y = this.positionY
        // this.addSecondBar()
        // this.addRotation()

        this.state = ObstacleState.Incoming
        scene.add(this.object);


    }

    addRotation() {
        this.object.rotateZ(degToRad(getRandomFloat(-25, 25)));

    }


    applyShift() {
        if (this.time == 0) {
            this.time = performance.now();
        } else {
            let elapsedTime = performance.now() - this.time;
            this.time = performance.now();
            this.positionX -= 0.012 * elapsedTime * gameConfig["gameSpeed"];
        }

        this.object.position.x = this.positionX;

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
        scene.remove(this.object)


    }
    changeColor(color) {
        this.object.material.color.setHex(color);

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