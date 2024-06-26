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

var nameList = [
    'Time', 'Past', 'Future', 'Dev',
    'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling',
    'Fall', 'Jump', 'Cliff', 'Mountain', 'Rend', 'Red', 'Blue',
    'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat',
    'Kitty', 'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit',
    'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper', 'Deepest',
    'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video',
    'Game', 'Donkey', 'Mule', 'Colt', 'Cult', 'Cultist', 'Magnum',
    'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code',
    'Script', 'Writer', 'Near', 'Close', 'Open', 'Cube', 'Circle',
    'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha',
    'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King',
    'Duke', 'Rest', 'Fire', 'Flame', 'Morrow', 'Break', 'Breaker', 'Numb',
    'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Rooster',
    'Sand', 'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big',
    'Small', 'Short', 'Tall', 'Sith', 'Bounty', 'Hunter', 'Cracked', 'Broken',
    'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies',
    'Lie', 'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Walker',
    'Zombie', 'Sarge', 'Capt', 'Captain', 'Punch', 'One', 'Two', 'Uno', 'Slice',
    'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound',
    'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich', 'Smasher', 'Extreme', 'Multi', 'Universe', 'Ultimate', 'Death', 'Ready', 'Monkey', 'Elevator', 'Wrench', 'Grease', 'Head', 'Theme', 'Grand', 'Cool', 'Kid', 'Boy', 'Girl', 'Vortex', 'Paradox'
];

function selectColor(colorNum, colors) {
    if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
    return "hsl(" + (colorNum * (360 / colors) % 360) + ",100%,50%)";
}

class Player {
    constructor(scene, playerId, name = null) {
        let material = new THREE.MeshBasicMaterial({ color: selectColor(playerId, 30) })
        material.opacity = 0.5
        this.object = new THREE.Mesh(new THREE.SphereGeometry(0.7), material);

        this.object.position.y = 30
        scene.add(this.object);
        this.yVelocity = 0;
        this.timeOfLastFrame = 0;
        this.timeOfLastJump = -100;
        this.points = 0;
        this.playerId = playerId
        this.isDead = false
        if (name == null) {
            this.name = nameList[playerId % nameList.length]
        } else {
            this.name = name
        }
    };
    getName() {
        return this.name
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