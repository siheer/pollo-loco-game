import CanvasObject from "./canvas-object.class.js";
import Character from "./main-character.class.js";

export default class GameItem extends CanvasObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.speed = 0;
        this.isJumping = false;
        this.speedY = 0;
        this.accelerationY = 3;
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

    applyGravity() {
        this.y += this.speedY;
        this.speedY += this.accelerationY;
    }
}