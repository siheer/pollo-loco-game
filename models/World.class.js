import CanvasObject from './canvas-object.class.js';
import GameItem from "./game-item.class.js";
import Bottle from "./bottle.class.js";
import Chicken from "./chicken.class.js";
import Chick from "./chick.class.js";
import Endboss from "./endboss.class.js";
import Coin from "./coin.class.js";
import ActionTimer from './action-timer.class.js';


export default class World {
    constructor(level) {
        window.world = this;
        this.canvas = level.canvas;
        this.ctx = this.canvas.ctx;
        this.level = level;
        this.cameraX = 0;
        this.collisionsDeltaTime = 0;
        this.initKeyBoardEventsDeltaTime = 0;
        this.createActionTimers();
    }

    createActionTimers() {
        this.bottleActionTimer = new ActionTimer(
            () => this.level.character.bottleSupply > 0,
            () => this.level.character.throwBottle(),
            0,
            200
        );
        this.spawnEnemiesActionTimer = new ActionTimer(
            () => true,
            () => this.level.spawnEnemies(),
            0,
            20000
        )
        this.spawnItemsActionTimer = new ActionTimer(
            () => true,
            () => this.level.spawnItems(),
            0,
            20000
        )
    }

    updateWorld(deltaTime) {
        this.updateWorldItems(this.level.levelItems, deltaTime);
        if (this.spawnEnemiesActionTimer.isPlayable()) {
            this.spawnEnemiesActionTimer.play();
        }
        if (this.spawnItemsActionTimer.isPlayable()) {
            this.spawnItemsActionTimer.play();
        }
    }

    updateWorldItems(reference, deltaTime) {
        if (Array.isArray(reference)) {
            reference.forEach(item => this.updateWorldItems(item, deltaTime));
        } else {
            reference.update?.(deltaTime);
        }
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

    checkForInitializingKeyboardEvents(deltaTime) {
        this.initKeyBoardEventsDeltaTime += deltaTime;
        if (this.initKeyBoardEventsDeltaTime > STANDARD_INTERVAL_IN_MILLISECONDS) {
            if (!this.level.character.isDead) {
                if (keyboardEvents.keys['a']) {
                    this.handleKeyA();
                }
                if (keyboardEvents.keys['Enter']) {
                    this.handleKeyEnter();
                }
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
        if (this.level.character.canBuyBottle()) {
            this.level.character.buyBottle();
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
            if (!enemy.isDead && this.level.character.isCollidingWith(enemy)) {
                this.handleCharacterCollisionWithEnemy(deltaTime, enemy);
            }
            if (!enemy.isDead) {
                this.handleBottlesCollisionWithEnemy(deltaTime, enemy);
            }
        });
    }

    handleCharacterCollisionWithEnemy(deltaTime, enemy) {
        if (this.level.character.isStomping(enemy)) {
            enemy.kill();
            this.level.character.giveRecoilOnStomp(20);
            this.level.character.energy += 3;
            this.level.character.dispatchCharacterEnergyEvent();
        } else {
            this.level.character.takeDamage(deltaTime, STANDARD_INTERVAL_IN_MILLISECONDS, 9);
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
            if (!bottle.canDealDamage && bottle.isCollidingWith(this.level.character)) {
                this.level.character.collectBottle(bottle);
            }
        });

        const coins = flattenToArray(this.level.levelItems, Coin);
        coins.forEach(coin => {
            if (coin.isCollidingWith(this.level.character)) {
                this.level.character.collectCoin(coin);
            }
        });
    }
}