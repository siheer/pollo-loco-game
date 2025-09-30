import CanvasObject from "./canvas-object.class.js";
import GameItem from "./game-item.class.js";
import Bottle from "./bottle.class.js";
import Chicken from "./chicken.class.js";
import Chick from "./chick.class.js";
import Endboss from "./endboss.class.js";
import Coin from "./coin.class.js";
import ActionTimer from "./action-timer.class.js";

/**
 * Represents the game world, handling updates, drawing, and collision checks.
 */
export default class World {
    /**
     * Creates a new World instance with a given level.
     * @param {Level} level - The current game level.
     */
    constructor(level) {
        window.world = this;
        this.canvas = level.canvas;
        this.ctx = this.canvas.ctx;
        this.level = level;
        this.cameraX = 0;
        this.collisionsDeltaTime = 0;
        this.initKeyBoardEventsDeltaTime = 0;
        this.initializeActionTimer();
    }

    /**
     * Initializes action timers for bottle throwing, bottle buying, enemy spawning, and item spawning.
     */
    initializeActionTimer() {
        this.bottleThrowAction = new ActionTimer(
            () => keyboardEvents.keys["a"] && this.level.character.bottleSupply > 0,
            () => this.level.character.throwBottle(),
            0,
            500
        );
        this.bottleBuyAction = new ActionTimer(
            () => keyboardEvents.keys["Enter"] && this.level.character.canBuyBottle(),
            () => this.level.character.buyBottle(),
            0,
            100
        );
        this.spawnEnemiesActionTimer = new ActionTimer(
            () => true,
            () => this.level.spawnEnemies(),
            0,
            20000
        );
        setTimeout(() => {
            // setTimeout to not execute at same frame as spawnEnemies
            this.spawnItemsActionTimer = new ActionTimer(
                () => true,
                () => this.level.spawnItems(),
                0,
                20000
            );
        });
    }

    /**
     * Updates the world state by updating all items and executing spawn timers.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    updateWorld(deltaTime) {
        this.updateWorldItems(this.level.levelItems, deltaTime);
        if (this.spawnEnemiesActionTimer.updateAndIsExecutable(deltaTime)) {
            this.spawnEnemiesActionTimer.execute();
        }
        if (this.spawnItemsActionTimer.updateAndIsExecutable(deltaTime)) {
            this.spawnItemsActionTimer.execute();
        }
    }

    /**
     * Recursively updates all items in the nested level items structure.
     * @param {*} reference - The current level items or sub-items.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    updateWorldItems(reference, deltaTime) {
        if (Array.isArray(reference)) {
            reference.forEach((item) => this.updateWorldItems(item, deltaTime));
        } else {
            reference.update?.(deltaTime);
        }
    }

    /**
     * Clears the canvas, applies camera translation, and draws all world items.
     */
    drawWorld() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(this.cameraX, 0);
        this.drawWorldItems(this.level.levelItems);
        this.ctx.restore();
    }

    /**
     * Recursively draws all items from a nested structure.
     * @param {*} items - The collection of world items.
     */
    drawWorldItems(items) {
        if (items) {
            if (Array.isArray(items)) {
                items.forEach((object) => this.drawWorldItems(object));
            } else if (items.constructor === Object) {
                Object.values(items).forEach((object) => this.drawWorldItems(object));
            } else {
                this.drawWorldItem(items);
            }
        }
    }

    /**
     * Draws a single world item, handling horizontal flipping if necessary.
     * @param {CanvasObject} item - The world item to draw.
     */
    drawWorldItem(item) {
        if (!this.isVisible(item)) return;
        if (item.isFacingOtherDirection) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                item.img,
                -item.x - item.width,
                item.y,
                item.width,
                item.height
            );
            this.ctx.restore();
        } else {
            this.ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
        }
    }


    /**
     * Checks whether a given game object is within or near the visible area of the canvas.
     * @param {Object} item - The game object to test for visibility.
     * @param {number} [padding=80] - Extra margin (in pixels) added to both sides of the canvas to prevent objects from "popping" in/out at the edges.
     * @returns {boolean} True if the object is within the extended visible area, otherwise false.
     */
    isVisible(item, padding = 80) {
        const screenX = item.x + this.cameraX;
        return screenX <= (this.canvas.width + padding) && (screenX + item.width) >= -padding;
    }

    /**
     * (Optional) Draws an outer frame around a game item.
     * @param {GameItem} item - The game item.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {number} width - The width.
     * @param {number} height - The height.
     */
    drawOuterFrame(item, x, y, width, height) {
        if (item instanceof GameItem) {
            this.ctx.beginPath();
            this.ctx.rect(x, y, width, height);
            this.ctx.stroke();
        }
    }

    /**
     * (Optional) Draws an inner frame based on the item's offset.
     * @param {GameItem} item - The game item.
     * @param {number} x - The x-coordinate.
     * @param {number} y - The y-coordinate.
     * @param {number} width - The width.
     * @param {number} height - The height.
     */
    drawInnerFrame(item, x, y, width, height) {
        if (item instanceof GameItem) {
            const innerX = x + item.offset.left;
            const innerY = y + item.offset.top;
            const innerWidth = width - item.offset.left - item.offset.right;
            const innerHeight = height - item.offset.top - item.offset.bottom;
            this.ctx.save();
            this.ctx.strokeStyle = "red";
            this.ctx.beginPath();
            this.ctx.rect(innerX, innerY, innerWidth, innerHeight);
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    /**
     * Checks for keyboard events to trigger bottle throw or bottle buy actions.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    checkForInitializingKeyboardEvents(deltaTime) {
        if (!this.level.character.isDead) {
            if (this.bottleThrowAction.updateAndIsExecutable(deltaTime)) {
                this.bottleThrowAction.execute();
            }
            if (this.bottleBuyAction.updateAndIsExecutable(deltaTime)) {
                this.bottleBuyAction.execute();
            }
        }
    }

    /**
     * Checks for collisions between the character, enemies, bottles, and coins.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    checkCollisions(deltaTime) {
        this.collisionsDeltaTime += deltaTime;
        if (this.collisionsDeltaTime >= MIN_INTERVAL_IN_MILLISECONDS) {
            this.handleEnemyInteractions(deltaTime);
            this.handleBottleAndCoinCollections();
            this.collisionsDeltaTime = 0;
        }
    }

    /**
     * Processes collisions between the character and enemies, handling interactions.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     */
    handleEnemyInteractions(deltaTime) {
        const enemies = flattenToArray(this.level.levelItems[1]);
        enemies.forEach((enemy) => {
            if (!enemy.isDead && this.level.character.isCollidingWith(enemy)) {
                this.handleCharacterCollisionWithEnemy(deltaTime, enemy);
            }
            if (!enemy.isDead) {
                this.handleBottlesCollisionWithEnemy(deltaTime, enemy);
            }
        });
    }

    /**
     * Handles collision between the character and an enemy.
     * Applies stomping logic or inflicts damage.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     * @param {*} enemy - The enemy involved in the collision.
     */
    handleCharacterCollisionWithEnemy(deltaTime, enemy) {
        if (this.level.character.isStomping(enemy)) {
            enemy.kill();
            if (!this.level.isAboveGround(enemy))
                this.level.character.giveRecoilOnStomp(20);
            this.level.character.dispatchCharacterEnergyEvent();
        } else {
            const damageAmount =
                enemy instanceof Endboss ? 10 : this.level.character.takesDamageAmount;
            this.level.character.takeDamage(
                deltaTime,
                STANDARD_INTERVAL_IN_MILLISECONDS,
                damageAmount
            );
        }
    }

    /**
     * Processes collisions between thrown bottles and enemies.
     * Breaks bottles and affects enemies accordingly.
     * @param {number} deltaTime - Elapsed time in milliseconds.
     * @param {*} enemy - The enemy involved in the collision.
     */
    handleBottlesCollisionWithEnemy(deltaTime, enemy) {
        const bottles = flattenToArray(this.level.levelItems, Bottle);
        bottles.forEach((bottle) => {
            if (
                bottle.canDealDamage &&
                !bottle.isBroken &&
                bottle.isCollidingWith(enemy)
            ) {
                bottle.breakBottle();
                if (enemy instanceof Chicken || enemy instanceof Chick) {
                    enemy.kill();
                } else if (enemy instanceof Endboss) {
                    window.soundManager.playNonOverlapping("endbossHurt");
                    enemy.takeDamage(deltaTime);
                }
            }
        });
    }

    /**
     * Handles collisions between the character and collectible bottles and coins.
     */
    handleBottleAndCoinCollections() {
        const bottles = flattenToArray(this.level.levelItems, Bottle);
        bottles.forEach((bottle) => {
            if (
                !bottle.canDealDamage &&
                bottle.isCollidingWith(this.level.character)
            ) {
                this.level.character.collectBottle(bottle);
            }
        });
        const coins = flattenToArray(this.level.levelItems, Coin);
        coins.forEach((coin) => {
            if (coin.isCollidingWith(this.level.character)) {
                this.level.character.collectCoin(coin);
            }
        });
    }

    /**
     * Attempt to prevent stutter, as soon as the camera is moved (resulting in a translation of the canvas context on horizontal axis)
     */
    async warmupCanvasTranslate() {
        this.drawWorld();
        await new Promise(requestAnimationFrame);
        this.cameraX = -1;
        this.drawWorld();
        await new Promise(requestAnimationFrame);
        this.cameraX = 1;
        this.drawWorld();
        await new Promise(requestAnimationFrame);
        this.cameraX = 0;
        this.drawWorld();
        await new Promise(requestAnimationFrame);
    }
}
