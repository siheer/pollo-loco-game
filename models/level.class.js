import BackgroundObject from './background-object.class.js';
import Character from './character.class.js';
import Cloud from './cloud.class.js';
import Chick from './chick.class.js';
import Chicken from './chicken.class.js';
import Endboss from './endboss.class.js';
import Coin from './coin.class.js';
import StandingBottle from "./standing-bottle.class.js";
import WorldImagePreloader from './world-image-preloader.class.js';

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
        this.itemsDefaultRepeatCount = this.levelXLengthFactor - 1;
    }

    /**
     * Initializes the level by creating the character and loading level items from an external module.
     * @returns {Promise<void>}
     */
    async init() {
        try {
            const currentLevel = await import(this.pathToLevelItems);
            if (!currentLevel.createLevelItems) throw Error('Level must provide a function "function createLevelItems(level, repeatCount)".')
            this.levelItems = currentLevel.createLevelItems(this, this.levelXLengthFactor);
            await WorldImagePreloader.preload();
        } catch (error) {
            console.error('Error loading level items:', error);
        }
    }

    /**
     * Creates background elements for the level.
     * @param {number} [repeatCount=this.defaultRepeatCount] - Repetition count for full background.
     * @returns {Array} Array of background objects.
     */
    createBackgrounds(repeatCount = this.levelXLengthFactor) {
        return [
            [
                ...Level.getBackgroundSecondPart(this.canvas, -this.canvas.width),
                ...Level.getFullBackground(this.canvas, repeatCount),
            ],
            new Cloud(this, './img/5_background/layers/4_clouds/1.png', 0, 0, this.canvas.width * 0.7, this.canvas.height * 0.7),
            ...this.repeatAcrossLevelSegments((offset) => {
                return new Cloud(this, './img/5_background/layers/4_clouds/1.png', offset, 0, this.canvas.width * 0.7, this.canvas.height * 0.7);
            }),
        ];
    }

    /**
     * Creates and assigns the main character of the level.
     * @param {number} [x=100] - The horizontal starting position of the character.
     * @param {number} [yOffset=1000] - Base vertical offset for calculating Y position.
     * @param {number} [yAdjust=0] - Additional vertical adjustment to fine-tune Y position (correct the y position by ca. 18 if character should not start in air).
     * @param {number} [width=250] - Width of the character.
     * @param {number} [height=500] - Height of the character.
     * @returns {Character} The created Character object.
     */
    createCharacter(x = 100, yOffset = 1000, yAdjust = 0 /* 18 */, width = 250, height = 500) {
        const y = this.getYPositionForObject(yOffset) + yAdjust;
        this.character = new Character(x, y, width, height, this);
        return this.character;
    }

    /**
     * Creates the Endboss object
     * @param {Level} level - The current level instance.
     * @param {number} [x=level.levelEndX] - Horizontal spawn position for the Endboss.
     * @param {number} [yOffset=600] - Vertical shift used by getYPositionForObject.
     * @param {number} [yAdjust=50] - Additional pixels to adjust the Y position.
     * @param {number} [width=515] - Width of the Endboss.
     * @param {number} [height=600] - Height of the Endboss.
     * @returns {Endboss} The created Endboss object.
     */
    createEndboss(x = this.levelEndX, yOffset = 600, yAdjust = 50, width = 515, height = 600) {
        const y = this.getYPositionForObject(yOffset) + yAdjust;
        return new Endboss(x, y, width, height);
    }

    /**
     * Creates enemy objects for the level.
     * @param {number} [repeatCount] - Number of segments to generate enemies for; defaults to all segments.
     * @param {number} [chickenCount=6] - Number of Chicken instances per segment.
     * @param {number} [chickCount=6] - Number of Chick instances per segment.
     * @param {number} [chickenY=this.getYPositionForObject(100)] - Vertical position for chickens.
     * @param {number} [chickenWidth=100] - Width of each Chicken.
     * @param {number} [chickenHeight=100] - Height of each Chicken.
     * @param {number} [chickY=this.getYPositionForObject(70)] - Vertical position for chicks.
     * @param {number} [chickWidth=70] - Width of each Chick.
     * @param {number} [chickHeight=70] - Height of each Chick.
     * @returns {Array} Array of created enemy objects (Chickens and Chicks).
     */
    createEnemies(repeatCount = undefined, chickenCount = 6, chickCount = 6, chickenY = this.getYPositionForObject(100), chickenWidth = 100, chickenHeight = 100, chickY = this.getYPositionForObject(70), chickWidth = 70, chickHeight = 70) {
        const creatorFunction = (offset) => {
            const chickenArgs = [this, offset, chickenY, chickenWidth, chickenHeight];
            const chickArgs = [this, offset, chickY, chickWidth, chickHeight];
            return [
                ...createInstances(Chicken, chickenCount, ...chickenArgs),
                ...createInstances(Chick, chickCount, ...chickArgs),
            ];
        };
        return this.spawnOutsideLevel ? this.spawnOutside(creatorFunction) : this.repeatAcrossLevelSegments(creatorFunction, repeatCount);
    }

    /**
     * Creates coin objects for the level.
     * @param {number} [repeatCount] - Number of segments to generate coins for; defaults to all segments.
     * @param {number} [coinCount=2] - Number of Coin instances per segment.
     * @param {number} [y=this.getYPositionForObject(200)] - Vertical position for the coins.
     * @param {number} [width=200] - Width of each Coin.
     * @param {number} [height=200] - Height of each Coin.
     * @returns {Array<Coin>} Array of created coin objects.
     */
    createCoins(repeatCount = undefined, coinCount = 2, y = this.getYPositionForObject(200), width = 200, height = 200) {
        const creatorFunction = (offset) => {
            const args = [this, offset, y, width, height];
            return createInstances(Coin, coinCount, ...args);
        };
        return this.spawnOutsideLevel ? this.spawnOutside(creatorFunction) : this.repeatAcrossLevelSegments(creatorFunction, repeatCount);
    }

    /**
     * Creates bottle objects for the level.
     * @param {number} [repeatCount] - Number of segments to generate bottles for; defaults to all segments.
     * @param {number} [bottleCount=1] - Number of StandingBottle instances per segment.
     * @param {number} [y=this.getYPositionForObject(110)] - Vertical position for the bottles.
     * @param {number} [width=120] - Width of each StandingBottle.
     * @param {number} [height=120] - Height of each StandingBottle.
     * @returns {Array<StandingBottle>} Array of created bottle objects.
     */
    createBottles(repeatCount = undefined, bottleCount = 1, y = this.getYPositionForObject(110), width = 120, height = 120) {
        const creatorFunction = (offset) => {
            const args = [this, offset, y, width, height];
            return createInstances(StandingBottle, bottleCount, ...args);
        }
        return this.spawnOutsideLevel ? this.spawnOutside(creatorFunction) : this.repeatAcrossLevelSegments(creatorFunction, repeatCount);
    }

    /**
     * Spawns enemy objects into the level and updates the level items order.
     */
    spawnEnemies() {
        this.spawnOutsideLevel = true;
        this.levelItems[1].push(this.createEnemies());
        this.moveCharacterReferenceToPaintLast();
        this.spawnOutsideLevel = false;
    }

    /**
     * Spawns coin and bottle items into the level and updates the level items order.
     */
    spawnItems() {
        this.levelItems.push(this.createCoins(), this.createBottles());
        this.moveCharacterReferenceToPaintLast();
    }

    /**
     * @param {Function} callback - The function to execute.
     * @param {number} offset - The offset, where the items are to be created and drawn.
     * @returns {Array} Array of created objects
     */
    spawnOutside(callback, offset = this.levelXLengthFactor - 1) {
        const result = callback(offset);
        return Array.isArray(result) ? result : [result];
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
    repeatAcrossLevelSegments(callback, repeatCount = this.itemsDefaultRepeatCount) {
        if (repeatCount === 0) {
            return [callback(0)] // draw items without offset at start of level
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