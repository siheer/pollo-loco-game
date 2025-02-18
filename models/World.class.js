import CanvasObject from './canvas-object.class.js';
import Character from "./character.class.js";
import Level from "./level.class.js";
import GameItem from "./game-item.class.js";

export default class World {
    constructor(gameCanvas) {
        this.canvas = gameCanvas;
        this.ctx = gameCanvas.ctx;
        this.groundLevel = 140;
        this.groundLevelY = gameCanvas.height - this.groundLevel;
        this.cameraX = 0;
        this.deltaTime = 0;
    }

    addLevel(pathToLevelItems, levelXLengthFactor) {
        this.level = new Level(this, pathToLevelItems, levelXLengthFactor);
    }

    async fillWorldWithObjects() {
        this.character = new Character(100, this.getYPositionForObject(1000) /* + 18 */, 250, 500, this); // correct y position by ca. + 18 if character should not start in air
        await this.level.fillLevelWithObjects();
        this.worldRefs = [this.level.levelItems, this.character];
    }

    updateWorld(reference, deltaTime) {
        if (Array.isArray(reference)) {
            reference.forEach(item => this.updateWorld(item, deltaTime));
        } else {
            reference.update?.(deltaTime);
        }
    }

    checkCollisions(deltaTime) {
        this.deltaTime += deltaTime;
        if (this.deltaTime >= MIN_INTERVAL_IN_MILLISECONDS) {
            const enemies = flattenToArray(this.level.levelItems[1]);
            enemies.forEach(enemy => {
                if (!enemy.isDead && this.character.isCollidingWith(enemy)) {
                    this.handleCollisionWithEnemy(deltaTime, enemy);
                }
            });
            this.deltaTime = 0;
        }
    }

    handleCollisionWithEnemy(deltaTime, enemy) {
        if (this.character.isStomping(enemy)) {
            enemy.kill();
            this.character.giveRecoilOnStomp(20);
        } else {
            this.character.takeDamage(deltaTime, 100);
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
                // this.drawOuterFrame(item, -item.x - item.width, item.y, item.width, item.height);
                this.drawInnerFrame(item, -item.x - item.width, item.y, item.width, item.height);
                this.ctx.restore();
            } else {
                this.ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
                // this.drawOuterFrame(item, item.x, item.y, item.width, item.height);
                this.drawInnerFrame(item, item.x, item.y, item.width, item.height);
            }
        }
    }

    drawOuterFrame(item, x, y, width, height) {
        if (item instanceof GameItem) {
            this.ctx.beginPath();
            this.ctx.rect(x, y, width, height);
            this.ctx.stroke();
        }
    }

    drawInnerFrame(item, x, y, width, height) {
        if (item instanceof GameItem) {
            const innerX = x + item.offset.left;
            const innerY = y + item.offset.top;
            const innerWidth = width - item.offset.left - item.offset.right;
            const innerHeight = height - item.offset.top - item.offset.bottom;
            this.ctx.save();
            this.ctx.strokeStyle = 'red';
            this.ctx.beginPath();
            this.ctx.rect(innerX, innerY, innerWidth, innerHeight);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    getYPositionForObject(shiftUpBy) { // argument value is normally height of canvas object
        return this.canvas.height - shiftUpBy - this.groundLevel;
    }

    isAboveGround(item) {
        return (item.y + item.height) < this.groundLevelY;
    }

    /**
     * Entfernt den angegebenen Gegner rekursiv aus dem levelItems-Array.
     */
    removeEnemy(enemy) {
        function removeFromArray(arr) {
            for (let i = arr.length - 1; i >= 0; i--) {
                if (arr[i] === enemy) {
                    arr.splice(i, 1);
                } else if (Array.isArray(arr[i])) {
                    removeFromArray(arr[i]);
                }
            }
        }
        removeFromArray(this.level.levelItems);
    }
}