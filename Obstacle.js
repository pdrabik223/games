import * as THREE from 'three';

function getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min));
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
        this.positionX = 25
        this.positionY = getRandomInt(-4, 6)

        this.objects = []
        this.time = 0
        this.objects[0] = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 1), new THREE.MeshBasicMaterial({ color: 0x30ff30 }));
        this.objects[0].position.x = 25
        this.objects[0].position.y = this.positionY
        this.addSecondBar()
        // this.addRotation()

        this.state = ObstacleState.Incoming
        for (let i = 0; i < this.objects.length; i++) {
            scene.add(this.objects[i]);
        }

    }
    addSecondBar() {
        this.objects[1] = new THREE.Mesh(new THREE.BoxGeometry(1, 10, 1), new THREE.MeshBasicMaterial({ color: 0x30ff30 }));
        this.objects[1].position.x = 25
        this.objects[1].position.y = 20 + this.positionY


    }
    addRotation() {
        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].rotateZ(degToRad(getRandomInt(-25, 25)));
        }
    }


    applyShift() {
        if (this.time == 0) {
            this.time = performance.now();
        } else {
            let elapsedTime = performance.now() - this.time;
            this.time = performance.now();
            this.positionX -= 0.012 * elapsedTime;
        }

        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].position.x = this.positionX;
        }

        if (this.positionX < 2 && this.positionX > -2) {
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
}

export { Obstacle, ObstacleState };