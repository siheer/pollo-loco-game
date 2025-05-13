/**
 * Creates level items including backgrounds, enemies, coins and bottles.
 * @param {Level} level - The current level instance.
 * @returns {Array} Array containing background elements, enemy objects, coins and bottles.
 */
export function createLevelItems(level) {
    const backgrounds = level.createBackgrounds();
    const enemies = [
        level.createEndboss(),
        ...level.createEnemies()
    ]
    const coins = [
        ...level.createCoins(0, 4),
        ...level.createCoins()
    ]
    const bottles = [
        ...level.createBottles(0, 2),
        ...level.createBottles()
    ]
    const character = level.createCharacter();

    return [
        backgrounds,
        enemies,
        coins,
        bottles,
        character
    ];
}