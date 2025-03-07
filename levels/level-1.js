import Level from "../models/level.class.js";
import Cloud from '../models/cloud.class.js';
import Chick from '../models/chick.class.js';
import Chicken from '../models/chicken.class.js';
import Endboss from '../models/endboss.class.js';
import Coin from '../models/coin.class.js';
import StandingBottle from "../models/standing-bottle.class.js";
export { createLevelItems, createEnemies, createCoins, createBottles };

/**
 * Creates level items including backgrounds, enemies, coins and bottles.
 * @param {Level} level - The current level instance.
 * @param {HTMLCanvasElement} canvas - The game canvas.
 * @param {number} repeatCount - Number of times the background segments repeat.
 * @returns {Array} Array containing background elements, enemy objects, coins and bottles.
 */
function createLevelItems(level, canvas, repeatCount) {
    const backgrounds = createBackgrounds(level, canvas, repeatCount);
    const enemies = createEnemies(level);
    enemies.push(new Endboss(level.levelEndX, level.getYPositionForObject(600) + 50, 515, 600));
    const coins = createInstances(Coin, 4, level, 0, level.getYPositionForObject(200), 200, 200);
    coins.push(...createCoins(level));
    const bottles = createInstances(StandingBottle, 2, level, 0, level.getYPositionForObject(110), 120, 120);
    bottles.push(...createBottles(level));
    return [
        backgrounds,
        enemies,
        ...coins,
        ...bottles
    ];
}

/**
 * Creates background elements for the level.
 * @param {Level} level - The current level instance.
 * @param {HTMLCanvasElement} canvas - The game canvas.
 * @param {number} repeatCount - Repetition count for full background.
 * @returns {Array} Array of background objects.
 */
function createBackgrounds(level, canvas, repeatCount) {
    return [
        [
            ...Level.getBackgroundSecondPart(canvas, -canvas.width),
            ...Level.getFullBackground(canvas, repeatCount),
        ],
        new Cloud(level, './img/5_background/layers/4_clouds/1.png', 0, 0, canvas.width * 0.7, canvas.height * 0.7),
        ...level.repeatAcrossLevelSegments((offset) => {
            return new Cloud(level, './img/5_background/layers/4_clouds/1.png', offset, 0, canvas.width * 0.7, canvas.height * 0.7);
        }),
    ];
}

/**
 * Creates enemy objects for the level.
 * @param {Level} level - The current level instance.
 * @returns {Array} Array of enemy objects.
 */
function createEnemies(level) {
    return level.repeatAcrossLevelSegments((offset) => {
        return [
            ...createInstances(Chicken, 6, level, offset, level.getYPositionForObject(100), 100, 100),
            ...createInstances(Chick, 6, level, offset, level.getYPositionForObject(70), 70, 70),
        ];
    });
}

/**
 * Creates coin objects for the level.
 * @param {Level} level - The current level instance.
 * @returns {Array} Array of coin objects.
 */
function createCoins(level) {
    return level.repeatAcrossLevelSegments((offset) => {
        return createInstances(Coin, 2, level, offset, level.getYPositionForObject(200), 200, 200);
    });
}

/**
 * Creates bottle objects for the level.
 * @param {Level} level - The current level instance.
 * @returns {Array} Array of bottle objects.
 */
function createBottles(level) {
    return level.repeatAcrossLevelSegments((offset) => {
        return createInstances(StandingBottle, 1, level, offset, level.getYPositionForObject(110), 120, 120);
    });
}