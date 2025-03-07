import BackgroundObject from '../models/background-object.class.js';
import Character from '../models/character.class.js';
import { createEnemies, createCoins, createBottles } from "../levels/level-1.js";

/**
 * Represents a game level.
 */
export default class Level {
    /**
     * Creates a new Level instance.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {string} pathToLevelItems - Path to the level items module.
     * @param {number} [levelXLengthFactor=1] - Factor for level length relative to the background parts.
     */
    constructor(canvas, pathToLevelItems, levelXLengthFactor = 1) {
        this.canvas = canvas;
        this.pathToLevelItems = pathToLevelItems;
        this.levelItems = [];
        this.backgroundParts = 2;
        this.levelXLengthFactor = levelXLengthFactor * this.backgroundParts;
        this.levelEndX = this.canvas.width * this.levelXLengthFactor - this.canvas.width;
        this.spawnOutsideLevel = false;
        this.groundLevel = 140;
        this.groundLevelY = this.canvas.height - this.groundLevel;
    }

    /**
     * Initializes the level by creating the character and loading level items from an external module.
     * @returns {Promise<void>}
     */
    async init() {
        try {
            this.character = new Character(100, this.getYPositionForObject(1000) /* + 18 */, 250, 500, this); // correct y position by ca. + 18 if character should not start in air
            const level = await import(this.pathToLevelItems);
            this.levelItems = level.createLevelItems(this, this.canvas, this.levelXLengthFactor);
            this.levelItems.push(this.character);
        } catch (error) {
            console.error('Error loading level items:', error);
        }
    }

    /**
     * Spawns enemy objects into the level and updates the level items order.
     */
    spawnEnemies() {
        this.spawnOutsideLevel = true;
        this.levelItems[1].push([
            createEnemies(this)
        ]);
        this.moveCharacterReferenceToPaintLast();
        this.spawnOutsideLevel = false;
    }

    /**
     * Spawns coin and bottle items into the level and updates the level items order.
     */
    spawnItems() {
        this.levelItems.push([
            createCoins(this),
            createBottles(this),
        ]);
        this.moveCharacterReferenceToPaintLast();
    }

    /**
     * Moves the character reference to the end of the level items array so that it is painted last.
     */
    moveCharacterReferenceToPaintLast() {
        const characterIndex = this.levelItems.findIndex(item => item instanceof Character);
        const character = this.levelItems.splice(characterIndex, 1);
        this.levelItems.push(character);
    }

    /**
     * Returns an array of background objects for the first part of the background.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {number} [shift=0] - Horizontal shift for background placement.
     * @returns {Array} Array of background objects.
     */
    static getBackgroundFirstPart(canvas, shift = 0) {
        return [
            new BackgroundObject(canvas, './img/5_background/layers/air.png', shift, 0, canvas.width + 1), // +1 to remove a strange line on the right
            new BackgroundObject(canvas, './img/5_background/layers/3_third_layer/1.png', shift),
            new BackgroundObject(canvas, './img/5_background/layers/2_second_layer/1.png', shift),
            new BackgroundObject(canvas, './img/5_background/layers/1_first_layer/1.png', shift),
        ];
    }

    /**
     * Returns an array of background objects for the second part of the background.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {number} [shift=canvas.width] - Horizontal shift for background placement.
     * @returns {Array} Array of background objects.
     */
    static getBackgroundSecondPart(canvas, shift = canvas.width) {
        return [
            new BackgroundObject(canvas, './img/5_background/layers/air.png', shift, 0, canvas.width + 1), // +1 to remove a strange line on the right
            new BackgroundObject(canvas, './img/5_background/layers/3_third_layer/2.png', shift),
            new BackgroundObject(canvas, './img/5_background/layers/2_second_layer/2.png', shift),
            new BackgroundObject(canvas, './img/5_background/layers/1_first_layer/2.png', shift),
        ];
    }

    /**
     * Generates a full background by repeating the first and second parts.
     * @param {HTMLCanvasElement} canvas - The game canvas.
     * @param {number} count - Number of repetitions.
     * @returns {Array} Array of background objects.
     */
    static getFullBackground(canvas, count) {
        let items = [];
        for (let i = 0; i < count; i++) {
            items.push(...Level.getBackgroundFirstPart(canvas, canvas.width * i));
            items.push(...Level.getBackgroundSecondPart(canvas, canvas.width * ++i));
        }
        return items;
    }

    /**
     * Returns a random x-coordinate within the specified segment.
     * @param {number} segmentIndex - The segment index.
     * @returns {number} Random x-coordinate.
     */
    getRandomXInSegment(segmentIndex) {
        return segmentIndex * this.canvas.width + Math.random() * this.canvas.width;
    }

    /**
     * Executes a callback across level segments and returns an array of results.
     * @param {Function} callback - The function to execute.
     * @param {number} [repeatCount=this.levelXLengthFactor - 1] - Number of segments to repeat.
     * @returns {Array} Array of results.
     */
    repeatAcrossLevelSegments(callback, repeatCount = this.levelXLengthFactor - 1) {
        if (this.spawnOutsideLevel) {
            return callback(this.levelXLengthFactor - 1);
        }

        let result = [];
        for (let canvasOffset = 1; canvasOffset < repeatCount; canvasOffset++) {
            result.push(callback(canvasOffset));
        }
        return result;
    }

    /**
     * Calculates the y-coordinate for an object based on a vertical shift.
     * @param {number} shiftUpBy - The number of pixels to shift up (typically the object height).
     * @returns {number} The calculated y-coordinate.
     */
    getYPositionForObject(shiftUpBy) { // argument value is normally height of canvas object
        return this.canvas.height - shiftUpBy - this.groundLevel;
    }

    /**
     * Determines if the given item is above the ground.
     * @param {CanvasObject} item - The item to check.
     * @returns {boolean} True if the item is above ground.
     */
    isAboveGround(item) {
        return (item.y + item.height) < this.groundLevelY;
    }

    /**
     * Removes an enemy from the nested level items array.
     * @param {*} enemy - The enemy to remove.
     */
    removeEnemy(enemy) {
        removeItemFromNestedArray(this.levelItems, enemy);
    }

    /**
     * Removes a bottle from the nested level items array.
     * @param {*} bottle - The bottle to remove.
     */
    removeBottle(bottle) {
        removeItemFromNestedArray(this.levelItems, bottle);
    }

    /**
     * Removes a coin from the nested level items array.
     * @param {*} coin - The coin to remove.
     */
    removeCoin(coin) {
        removeItemFromNestedArray(this.levelItems, coin);
    }
}