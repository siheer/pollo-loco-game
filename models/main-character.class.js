import GameItem from "./game-item.class.js";

export default class Character extends GameItem {
    constructor(x, y, width, height, world) {
        super(x, y, width, height);
        this.world = world;
        this.fixCameraOnCharacter = false;
        this.fixCameraOnCharacterXPosition = 500;
        this.loadImage('img/2_character_pepe/1_idle/idle/I-1.png');
        this.idleImg = this.img;
        this.speed = 40;
        this.initialSpeedY = -50;
        this.facingLeft = false;
        this.provideAnimations();
    }

    provideAnimations() {
        this.walkingAnimation = this.createAnimation([
            './img/2_character_pepe/2_walk/W-21.png',
            './img/2_character_pepe/2_walk/W-22.png',
            './img/2_character_pepe/2_walk/W-23.png',
            './img/2_character_pepe/2_walk/W-24.png',
            './img/2_character_pepe/2_walk/W-25.png',
            './img/2_character_pepe/2_walk/W-26.png',
        ]);

        this.jumpingAnimation = this.createAnimation([
            './img/2_character_pepe/3_jump/J-31.png',
            './img/2_character_pepe/3_jump/J-32.png',
            './img/2_character_pepe/3_jump/J-33.png',
            './img/2_character_pepe/3_jump/J-34.png',
            './img/2_character_pepe/3_jump/J-35.png',
            './img/2_character_pepe/3_jump/J-36.png',
            './img/2_character_pepe/3_jump/J-37.png',
            './img/2_character_pepe/3_jump/J-38.png',
            './img/2_character_pepe/3_jump/J-39.png',
        ]);
    }

    /**
     * Main update method called on every frame.
     * It updates the camera, handles jump and horizontal movement,
     * and reverts to the idle state if no movement is triggered.
     */
    update(deltaTime) {
        this.isCameraToBeFixed();
        this.handleJump(deltaTime);
        this.handleHorizontalMovement(deltaTime);
        if (!this.isJumping && keyboardEvents.nokeyPressed()) {
            this.img = this.idleImg;
        }
    }

    /**
     * Fix the camera on the character when the x-position exceeds a threshold.
     */
    isCameraToBeFixed() {
        if (!this.fixCameraOnCharacter && this.x > this.fixCameraOnCharacterXPosition) {
            this.fixCameraOnCharacter = true;
        }
    }

    /**
     * Handle jump logic:
     * - If the jump key is pressed while on the ground, initiate a jump.
     * - If in the air, always update the jump animation and apply gravity.
     */
    handleJump(deltaTime) {
        const onGround = !this.world.isAboveGround(this);
        if (keyboardEvents.keys[' '] && onGround) {
            // Initiate jump when on the ground and jump key is pressed.
            this.speedY = this.initialSpeedY;
            this.isJumping = true;
            this.onJump(deltaTime);
        } else if (!onGround) {
            // In the air, continue applying gravity and updating the jump animation.
            this.isJumping = true;
            this.onJump(deltaTime);
        } else {
            // On the ground without a jump input.
            this.isJumping = false;
            this.jumpingAnimation.currentImageIndex = 0;
        }
    }

    /**
     * Handle horizontal movement based on left/right arrow key input.
     */
    handleHorizontalMovement(deltaTime) {
        if (keyboardEvents.keys['ArrowRight'] && this.x < this.world.level.levelEndX) {
            this.onRight(deltaTime);
        } else if (keyboardEvents.keys['ArrowLeft'] && this.x > 0) {
            this.onLeft(deltaTime);
        }
    }

    /**
     * Update jump animation and apply gravity.
     */
    onJump(deltaTime) {
        this.updateAnimation(this.jumpingAnimation, deltaTime);
        this.applyGravity();
        if (!this.world.isAboveGround(this)) {
            this.y = this.world.groundLevelY - this.height + 18; // + 18 because of character shadow
        }
    }

    /**
     * Handle movement to the right.
     */
    onRight(deltaTime) {
        this.facingLeft = false;
        if (!this.isJumping) {
            this.updateAnimation(this.walkingAnimation, deltaTime, 60);
        }
        this.moveRight();
        this.setCameraXPosition();
    }

    /**
     * Handle movement to the left.
     */
    onLeft(deltaTime) {
        this.facingLeft = true;
        if (!this.isJumping) {
            this.updateAnimation(this.walkingAnimation, deltaTime, 60);
        }
        this.moveLeft();
        this.setCameraXPosition();
    }

    /**
     * Adjust the world camera based on the character's x-position.
     */
    setCameraXPosition() {
        if (this.fixCameraOnCharacter) {
            this.world.cameraX = this.fixCameraOnCharacterXPosition - this.x;
        }
    }
}
