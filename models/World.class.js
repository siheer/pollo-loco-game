import CanvasObject from './canvas-object.class.js';
import Character from "./character.class.js";
import Level from "./level.class.js";
import GameItem from "./game-item.class.js";
import Bottle from "./bottle.class.js";
import Chicken from "./chicken.class.js";
import Chick from "./chick.class.js";
import Endboss from "./endboss.class.js";
import Coin from "./coin.class.js";
import ActionTimer from './action-timer.class.js';
import { createEnemies, createCoins, createBottles } from "../levels/level-1.js";

export default class World {
    constructor(gameCanvas) {
        this.canvas = gameCanvas;
        this.ctx = gameCanvas.ctx;
        this.groundLevel = 140;
        this.groundLevelY = gameCanvas.height - this.groundLevel;
        this.cameraX = 0;
        this.collisionsDeltaTime = 0;
        this.initKeyBoardEventsDeltaTime = 0;
        this.bottleActionTimer = new ActionTimer(
            () => this.character.bottleSupply > 0,
            () => this.character.throwBottle(),
            0,
            200
        )
    }

    addLevel(pathToLevelItems, levelXLengthFactor) {
        this.level = new Level(this, pathToLevelItems, levelXLengthFactor);
    }

    async fillWorldWithObjects() {
        this.character = new Character(100, this.getYPositionForObject(1000) /* + 18 */, 250, 500, this); // correct y position by ca. + 18 if character should not start in air
        await this.level.fillLevelWithObjects();
        this.level.levelItems.push(this.character);
        this.spawnRegularly();
    }

    spawnRegularly() {
        setInterval(() => {
            this.level.spawnOutsideLevel = true;
            this.level.levelItems[1].push([
                createEnemies(this)
            ]);
            this.level.spawnOutsideLevel = false;
        }, 10000);
        setInterval(() => {
            this.level.levelItems.push([
                createCoins(this),
                createBottles(this),
            ])
        }, 15000);
        this.moveCharacterReferenceToPaintLast();
    }

    moveCharacterReferenceToPaintLast() {
        const characterIndex = this.level.levelItems.findIndex(item => item instanceof Character);
        const character = this.level.levelItems.splice(characterIndex, 1);
        this.level.levelItems.push(character);
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
            if (keyboardEvents.keys['Enter']) {
                this.handleKeyEnter();
            }
            this.initKeyBoardEventsDeltaTime = 0;
        }
    }

    handleKeyA() {
        if (this.bottleActionTimer.isPlayable()) {
            this.bottleActionTimer.play();
        }
    }

    handleKeyEnter() {
        if (this.character.canBuyBottle()) {
            this.character.buyBottle();
        }
    }

    checkCollisions(deltaTime) {
        this.collisionsDeltaTime += deltaTime;
        if (this.collisionsDeltaTime >= MIN_INTERVAL_IN_MILLISECONDS) {
            this.handleEnemyInteractions(deltaTime);
            this.handleBottleAndCoinCollections();
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
            this.character.energy += 3;
            this.character.dispatchCharacterEnergyEvent();
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

    handleBottleAndCoinCollections() {
        const bottles = flattenToArray(this.level.levelItems, Bottle);
        bottles.forEach(bottle => {
            if (!bottle.canDealDamage && bottle.isCollidingWith(this.character)) {
                this.character.collectBottle(bottle);
            }
        });

        const coins = flattenToArray(this.level.levelItems, Coin);
        coins.forEach(coin => {
            if (coin.isCollidingWith(this.character)) {
                this.character.collectCoin(coin);
            }
        });
    }

    drawWorld() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);
        this.drawWorldItems(this.level.levelItems);
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

    removeCoin(coin) {
        removeItemFromNestedArray(this.level.levelItems, coin);
    }
}