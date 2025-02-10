import CanvasObject from "./canvas-object.class.js";

export default class GameItem extends CanvasObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
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

    updateAnimation(animation, deltaTime, updateInterval = 100) {
        animation.deltaTime += deltaTime;
        if (animation.deltaTime >= updateInterval) {
            this.animate(animation);
            animation.deltaTime = 0;
        }
    }

    animate(animation) {
        animation.currentImageIndex = animation.currentImageIndex % animation.imageCache.length;
        this.img = animation.imageCache[animation.currentImageIndex];
        animation.currentImageIndex++;
    }

    moveRight(x) {
        this.x += x;
    }

    moveLeft(x) {
        this.x -= x;
    }
}