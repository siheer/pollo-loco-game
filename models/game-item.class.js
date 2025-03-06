import CanvasObject from "./canvas-object.class.js";

/**
 * Represents a game item with movement, collision, and animation capabilities.
 * Extends CanvasObject.
 */
export default class GameItem extends CanvasObject {
    /**
     * Creates a new GameItem instance.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {number} width - The width of the item.
     * @param {number} height - The height of the item.
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.offset = { left: 0, top: 0, right: 0, bottom: 0 };
        this.speedX = 0;
        this.speedY = 0;
        this.accelerationY = 3;
        this.justJumped = false;
        this.isDead = false;
        this.energy = this.maxEnergy = 0;
        this.isHurt = false;
        this.deltaTimeApplyGravity = 0;
        this.deltaTimeTakeDamage = 0;
    }

    /**
     * Creates an animation object using the provided image paths.
     * @param {string[]} paths - Array of image paths.
     * @returns {object} Animation object.
     */
    createAnimation(paths) {
        return {
            currentImageIndex: 0,
            deltaTime: 0,
            imageCache: this.createImageCache(paths),
        }
    }

    /**
     * Creates and returns an array of images from the provided paths.
     * @param {string[]} paths - Array of image paths.
     * @returns {HTMLImageElement[]} Array of image elements.
     */
    createImageCache(paths) {
        return paths.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
    }

    /**
     * Updates the given animation based on elapsed deltaTime and a specified update interval.
     * @param {object} animation - The animation object.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     * @param {number} [updateIntervalInMilliseconds=STANDARD_INTERVAL_IN_MILLISECONDS] - Interval for frame update.
     */
    updateAnimation(animation, deltaTime, updateIntervalInMilliseconds = STANDARD_INTERVAL_IN_MILLISECONDS) {
        animation.deltaTime += deltaTime;
        if (animation.deltaTime >= updateIntervalInMilliseconds) {
            this.replaceImage(animation);
            animation.deltaTime = 0;
        }
    }

    /**
     * Checks if the animation has passed the last frame.
     * @param {object} animation - The animation object.
     * @returns {boolean} True if the current frame index equals the image cache length.
     */
    isAnimationAfterLastFrame(animation) {
        return animation.currentImageIndex === animation.imageCache.length;
    }

    /**
     * Replaces the current image with the next frame in the animation.
     * Updates the image index cyclically.
     * @param {object} animation - The animation object.
     */
    replaceImage(animation) {
        animation.currentImageIndex = animation.currentImageIndex % animation.imageCache.length;
        this.img = animation.imageCache[animation.currentImageIndex];
        animation.currentImageIndex++;
    }

    /**
     * Moves the game item to the right by the specified speed.
     * @param {number} [speedX=this.speedX] - The horizontal speed.
     */
    moveRight(speedX = this.speedX) {
        this.x += speedX;
    }

    /**
     * Moves the game item to the left by the specified speed.
     * @param {number} [speedX=this.speedX] - The horizontal speed.
     */
    moveLeft(speedX = this.speedX) {
        this.x -= speedX;
    }

    /**
     * Applies gravity to the game item based on the elapsed deltaTime.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     * @param {number} [updateInterval=STANDARD_INTERVAL_IN_MILLISECONDS] - Interval for gravity update.
     */
    applyGravity(deltaTime, updateInterval = STANDARD_INTERVAL_IN_MILLISECONDS) {
        this.deltaTimeApplyGravity += deltaTime;
        if (this.deltaTimeApplyGravity > updateInterval) {
            this.y += this.speedY;
            this.speedY += this.accelerationY;
        }
    }

    /**
     * Sets the item on the ground if it is below the ground level, using an optional correction offset.
     * @param {number} [correctionOffset=0] - The correction offset.
     */
    setItemOnGroundIfUnderGround(correctionOffset = 0) {
        if (!window.world.level.isAboveGround(this)) {
            this.y = window.world.level.groundLevelY - this.height + correctionOffset;
        }
    }

    /**
     * Checks if this game item is colliding with another item based on their positions and offsets.
     * @param {GameItem} item - The other game item.
     * @returns {boolean} True if colliding.
     */
    isCollidingWith(item) {
        return this.x + this.width - this.offset.right > item.x + item.offset.left &&
            this.y + this.height - this.offset.bottom > item.y + item.offset.top &&
            this.x + this.offset.left < item.x + item.width - item.offset.right &&
            this.y + this.offset.top < item.y + item.height - item.offset.bottom;
    }

    /**
     * Inflicts damage to the game item over time and updates its state.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     * @param {number} [updateInterval=STANDARD_INTERVAL_IN_MILLISECONDS] - Interval for damage application.
     * @param {number} [damage=5] - Damage amount.
     */
    takeDamage(deltaTime, updateInterval = STANDARD_INTERVAL_IN_MILLISECONDS, damage = 5) {
        this.deltaTimeTakeDamage += deltaTime;
        if (this.deltaTimeTakeDamage > updateInterval) {
            this.energy -= damage;
            this.isDead = this.energy < 0;
            this.isHurt = true;
            this.deltaTimeTakeDamage = 0;
        }
    }

    /**
     * Marks the game item as dead, plays killed sounds, updates the image to the dead image,
     * and schedules its removal from the level.
     */
    kill() {
        this.isDead = true;
        this.playKilledSounds();
        if (this.deadImg) {
            this.img = this.deadImg;
        }
        setTimeout(() => {
            window.world.level.removeEnemy(this);
        }, 500);
    }

    /**
     * Plays sound effects based on the type of enemy when it is killed.
     */
    playKilledSounds() {
        if (this.constructor.name === 'Chick') {
            window.soundManager.play('chickStomped');
        } else if (this.constructor.name === 'Chicken') {
            window.soundManager.play('chickenStomped');
        }
    }
}