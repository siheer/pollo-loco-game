import CanvasObject from './canvas-object.class.js';
import GameItem from './game-item.class.js';
import Chick from './chick.class.js';
import Chicken from './chicken.class.js';
import PlayerCharacter from "./player-character.class.js";
import BackgroundObject from './background-object.class.js';
import Cloud from './cloud.class.js';

export default class World {
    constructor(gameCanvas) {
        this.canvas = gameCanvas;
        this.ctx = gameCanvas.ctx;
        this.fillWorldWithObjects();
        this.makeAvailableToWindowObjectForDebugging();
    }

    fillWorldWithObjects() {
        this.player = new PlayerCharacter(100, this.getYPositionForObject(400) + 13, 200, 400); // +13 because of shadow.
        this.enemies = createInstances(Chicken, 4, this.getYPositionForObject(80), 80, 80);
        this.clouds = [
            new Cloud('./img/5_background/layers/4_clouds/1.png', this.canvas.width / 3, 0, this.canvas.width * 0.7, this.canvas.height * 0.7),
        ]
        this.backgrounds = [
            new BackgroundObject('./img/5_background/layers/air.png', 0, 0, this.canvas.width + 1), // + 1 to get rid of strange line on the left
            new BackgroundObject('./img/5_background/layers/3_third_layer/1.png'),
            new BackgroundObject('./img/5_background/layers/2_second_layer/1.png'),
            new BackgroundObject('./img/5_background/layers/1_first_layer/1.png'),
        ]

        this.objectRefs = [this.player, ...this.enemies, ...this.clouds, ...this.backgrounds];
    }

    updateWorld(deltaTime) {
        this.objectRefs.forEach(object => {
            if (Array.isArray(object)) {
                object.forEach(item => item.update?.(deltaTime));
            } else {
                object.update?.(deltaTime);
            }
        });
    }

    drawWorld() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.canvas.resizeToDevicePixelRatio();

        this.drawObjects(this.backgrounds);
        this.drawObjects(this.clouds);
        this.drawObjects(this.enemies);
        this.drawGameItem(this.player);
    }

    drawObjects(collection) {
        collection.forEach(object => this.drawGameItem(object));
    }

    drawGameItem(item) {
        this.ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
    }

    makeAvailableToWindowObjectForDebugging() {
        window.gameCanvas = this.canvas;
        window.ctx = this.ctx;
        window.world = this;
    }

    getYPositionForObject(heightOfCanvasObject) {
        return this.canvas.height - heightOfCanvasObject - 140;// - xy -> the baseline for the objects in the canvas
    }
}