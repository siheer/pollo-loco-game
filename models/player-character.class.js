import GameItem from "./game-item.class.js";

export default class PlayerCharacter extends GameItem {
    constructor(x, y, width, height, world) {
        super(x, y, width, height);
        this.world = world;
        this.fixCameraOnCharacter = false;
        this.fixCameraOnCharacterXPosition = 500;
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.idleImg = this.img;
        this.speed = 40;
        this.facingLeft = false;
        this.walkingAnimation = this.createAnimation([
            './img/2_character_pepe/2_walk/W-21.png',
            './img/2_character_pepe/2_walk/W-22.png',
            './img/2_character_pepe/2_walk/W-23.png',
            './img/2_character_pepe/2_walk/W-24.png',
            './img/2_character_pepe/2_walk/W-25.png',
            './img/2_character_pepe/2_walk/W-26.png',
        ]);
    }

    update(deltaTime) {
        if (!this.fixCameraOnCharacter && this.x > this.fixCameraOnCharacterXPosition) {
            this.fixCameraOnCharacter = true;
        }
        if (keyboardEvents.keys['ArrowRight'] && this.x < this.world.level.levelEndX) {
            onRight.call(this);
        } else if (keyboardEvents.keys['ArrowLeft'] && this.x > 0) {
            onLeft.call(this);
        } else if (keyboardEvents.nokeyPressed()) {
            this.img = this.idleImg;
        }


        function onRight() {
            this.facingLeft = false;
            this.updateAnimation(this.walkingAnimation, deltaTime, 60);
            this.moveRight();
            setCameraXPosition.call(this);
        }

        function onLeft() {
            this.facingLeft = true;
            this.updateAnimation(this.walkingAnimation, deltaTime, 60);
            this.moveLeft();
            setCameraXPosition.call(this);
        }

        function setCameraXPosition() {
            if (this.fixCameraOnCharacter) {
                this.world.cameraX = this.fixCameraOnCharacterXPosition - this.x;
            }
        }
    }

    moveUp(y) {
        this.y -= y;
    }

    moveDown(y) {
        this.y += y;
    }

    jump(y) {
        // Jump-Implementierung (falls benötigt) hier einfügen.
    }
}