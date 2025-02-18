import CanvasObject from "./canvas-object.class.js";
import Character from "./character.class.js";

export default class GameItem extends CanvasObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.speed = 0;
        this.isJumping = false;
        this.speedY = 0;
        this.accelerationY = 3;
        this.offset = { left: 0, top: 0, right: 0, bottom: 0 };
        this.isDead = false;
        this.energy = this.maxEnergy = 10;
        this.deltaTimeApplyGravity = 0;
        this.deltaTimeTakeDamage = 0;
    }

    createAnimation(paths) {
        return {
            currentImageIndex: 0,
            deltaTime: 0,
            imageCache: this.createImageCache(paths),
        }
    }

    createImageCache(paths) {
        return paths.map(path => {
            const img = new Image();
            img.src = path;
            return img;
        });
    }

    updateAnimation(animation, deltaTime, updateIntervalInMilliseconds = 100) {
        animation.deltaTime += deltaTime;
        if (animation.deltaTime >= updateIntervalInMilliseconds) {
            this.replaceImage(animation);
            animation.deltaTime = 0;
        }
    }

    replaceImage(animation) {
        animation.currentImageIndex = animation.currentImageIndex % animation.imageCache.length;
        this.img = animation.imageCache[animation.currentImageIndex];
        animation.currentImageIndex++;
    }

    moveRight() {
        this.x += this.speed;
    }

    moveLeft() {
        this.x -= this.speed;
    }

    applyGravity(deltaTime, updateInterval) {
        this.deltaTimeApplyGravity += deltaTime;
        if (this.deltaTimeApplyGravity > updateInterval) {
            this.y += this.speedY;
            this.speedY += this.accelerationY;
        }
    }

    isCollidingWith(item) {
        return this.x + this.width - this.offset.right > item.x + item.offset.left &&
            this.y + this.height - this.offset.bottom > item.y + item.offset.top &&
            this.x + this.offset.left < item.x + item.width - item.offset.right &&
            this.y + this.offset.top < item.y + item.height - item.offset.bottom;
    }

    takeDamage(deltaTime, updateInterval, damage = 5) {
        this.deltaTimeTakeDamage += deltaTime;
        if (this.deltaTimeTakeDamage > updateInterval) {
            // console.log(`Collision detected! ${this.constructor.name} energy: ', ${this.energy}`);
            this.energy -= damage;
            this.isDead = this.energy < 0;
            this.lastHurtTime = performance.now();
            this.deltaTimeTakeDamage = 0;
        }
    }

    isHurt() {
        return performance.now() - this.lastHurtTime < this.hurtingDuration;
    }

    kill() {
        this.isDead = true;
        if (this.deadImg) {
            this.img = this.deadImg;
        }
        setTimeout(() => {
            if (window.world && window.world.removeEnemy) {
                window.world.removeEnemy(this);
            }
        }, 500);
    }
}