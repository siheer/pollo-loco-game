import CanvasObject from './canvas-object.class.js';
import PlayerCharacter from "./player-character.class.js";
import Level from "./level.class.js";

export default class World {
    constructor(gameCanvas) {
        this.canvas = gameCanvas;
        this.ctx = gameCanvas.ctx;
        this.level = new Level(this, '../levels/level-1.js', 4);
        this.cameraX = 0;
        this.makeAvailableToWindowObjectForDebugging();
        window.drawWorldItem = this.drawWorldItem.bind(this);
    }

    addLevel(pathToLevelItems, levelXLengthFactor) {
        this.level = new Level(this, pathToLevelItems, levelXLengthFactor);
    }

    async fillWorldWithObjects() {
        this.player = new PlayerCharacter(100, this.getYPositionForObject(500) + 13, 250, 500, this); // +13 because of shadow.
        await this.level.fillLevelWithObjects();
        this.worldRefs = [this.level.levelItems, this.player];
    }

    updateWorld(reference, deltaTime) {
        if (Array.isArray(reference)) {
            reference.forEach(item => this.updateWorld(item, deltaTime));
        } else {
            reference.update?.(deltaTime);
        }
    }

    drawWorld() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);
        this.drawWorldItems(this.worldRefs);
        this.ctx.restore();
    }

    drawWorldItems(items) {
        if (items) {
            if (Array.isArray(items)) {
                items.forEach(object => this.drawWorldItems(object));
            } else if (items.constructor === Object) {
                Object.values(items).forEach(object => this.drawWorldItems(object));
            } else {
                this.drawWorldItem(items);
            }
        }
    }

    drawWorldItem(item) {
        if (item instanceof CanvasObject) {
            if (item.facingLeft) {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(item.img, -item.x - item.width, item.y, item.width, item.height);
                this.ctx.restore();
            } else {
                this.ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
            }
        }
    }

    getYPositionForObject(heightOfCanvasObject) {
        return this.canvas.height - heightOfCanvasObject - 140; // - 140 because of the baseline for the objects in the canvas
    }

    makeAvailableToWindowObjectForDebugging() {
        window.gameCanvas = this.canvas;
        window.ctx = this.ctx;
        window.world = this;
    }
}