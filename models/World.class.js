import CanvasObject from './canvas-object.class.js';
import Character from "./character.class.js";
import Level from "./level.class.js";
import GameItem from "./game-item.class.js";
import Bottle from "./bottle.class.js";
import Chicken from "./chicken.class.js";
import Chick from "./chick.class.js";
import Endboss from "./endboss.class.js";

export default class World {
    constructor(gameCanvas) {
        this.canvas = gameCanvas;
        this.ctx = gameCanvas.ctx;
        this.groundLevel = 140;
        this.groundLevelY = gameCanvas.height - this.groundLevel;
        this.cameraX = 0;
        this.collisionsDeltaTime = 0;
        this.initKeyBoardEventsDeltaTime = 0;
        this.timeSinceLastBottleThrown = -BOTTLE_THROW_DELAY;
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

    checkForInitializingKeyboardEvents(deltaTime) {
        this.initKeyBoardEventsDeltaTime += deltaTime;
        if (this.initKeyBoardEventsDeltaTime > STANDARD_INTERVAL_IN_MILLISECONDS) {
            if (keyboardEvents.keys['a']) {
                this.handleKeyA();
            }
            this.initKeyBoardEventsDeltaTime = 0;
        }
    }

    handleKeyA() {
        if (performance.now() - this.timeSinceLastBottleThrown > BOTTLE_THROW_DELAY) {
            this.character.throwBottle();
            this.timeSinceLastBottleThrown = performance.now();
        }
    }

    checkCollisions(deltaTime) {
        this.collisionsDeltaTime += deltaTime;
        if (this.collisionsDeltaTime >= MIN_INTERVAL_IN_MILLISECONDS) {
            this.handleEnemyInteractions(deltaTime);
            this.collisionsDeltaTime = 0;
        }
    }

    handleEnemyInteractions(deltaTime) {
        const enemies = flattenToArray(this.level.levelItems[1]);
        enemies.forEach(enemy => {
            if (!enemy.isDead && this.character.isCollidingWith(enemy)) {
                this.handleCharacterCollisionWithEnemy(deltaTime, enemy);
            }
            if (!enemy.isDead) {
                this.handleBottlesCollisionWithEnemy(deltaTime, enemy);
            }
        });
    }

    handleCharacterCollisionWithEnemy(deltaTime, enemy) {
        if (this.character.isStomping(enemy)) {
            enemy.kill();
            this.character.giveRecoilOnStomp(20);
        } else {
            this.character.takeDamage(deltaTime);
        }
    }

    handleBottlesCollisionWithEnemy(deltaTime, enemy) {
        const bottles = flattenToArray(this.level.levelItems, Bottle);
        bottles.forEach(bottle => {
            if (bottle.canDealDamage && !bottle.isBroken && bottle.isCollidingWith(enemy)) {
                bottle.breakBottle();
                if (enemy instanceof Chicken || enemy instanceof Chick) {
                    enemy.kill();
                } else if (enemy instanceof Endboss) {
                    enemy.takeDamage(deltaTime);
                }
            }
        });
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
            if (item.isFacingLeft) {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.drawImage(item.img, -item.x - item.width, item.y, item.width, item.height);
                // this.drawOuterFrame(item, -item.x - item.width, item.y, item.width, item.height);
                // this.drawInnerFrame(item, -item.x - item.width, item.y, item.width, item.height);
                this.ctx.restore();
            } else {
                this.ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
                // this.drawOuterFrame(item, item.x, item.y, item.width, item.height);
                // this.drawInnerFrame(item, item.x, item.y, item.width, item.height);
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

    removeEnemy(enemy) {
        removeItemFromNestedArray(this.level.levelItems, enemy);
    }

    removeBottle(bottle) {
        removeItemFromNestedArray(this.level.levelItems, bottle);
    }
}