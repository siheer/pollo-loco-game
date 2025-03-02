import Level from "../models/level.class.js";
import Cloud from '../models/cloud.class.js';
import Chick from '../models/chick.class.js';
import Chicken from '../models/chicken.class.js';
import Endboss from '../models/endboss.class.js';
import Coin from '../models/coin.class.js';
import StandingBottle from "../models/standing-bottle.class.js";

export { createLevelItems, createEnemies, createCoins, createBottles };

function createLevelItems(level, canvas, repeatCount) {
    const backgrounds = createBackgrounds(level, canvas, repeatCount);
    const enemies = createEnemies(level);
    enemies.push(new Endboss(level.levelEndX, level.getYPositionForObject(600) + 50, 515, 600));
    const coins = createInstances(Coin, 4, 0, level.getYPositionForObject(200), 200, 200);
    coins.push(...createCoins(level));
    const bottles = createInstances(StandingBottle, 2, 0, level.getYPositionForObject(110), 120, 120);
    bottles.push(...createBottles(level));

    //FDPO
    // const enemies = createInstances(Chicken, 1, 0.5, level.getYPositionForObject(100), 100, 100);
    // enemies.push(...createInstances(Chick, 1, 0.5, level.getYPositionForObject(70), 70, 70));
    // enemies.push(new Endboss(level.levelEndX, level.getYPositionForObject(600) + 50, 515, 600));
    // const coins = createInstances(Coin, 1, 0.5, level.getYPositionForObject(200), 200, 200);
    // const bottles = createInstances(StandingBottle, 1, 0.5, level.getYPositionForObject(110), 120, 120);

    return [
        backgrounds,
        enemies,
        ...coins,
        ...bottles
    ]
}

function createBackgrounds(level, canvas, repeatCount) {
    return [
        [
            ...Level.getBackgroundSecondPart(canvas, -canvas.width),
            ...Level.getFullBackground(canvas, repeatCount),
        ],
        new Cloud('./img/5_background/layers/4_clouds/1.png', 0, 0, canvas.width * 0.7, canvas.height * 0.7),
        ...level.repeatAcrossLevelSegments((offset) => {
            return new Cloud('./img/5_background/layers/4_clouds/1.png', offset, 0, canvas.width * 0.7, canvas.height * 0.7);
        }),
    ];
}

function createEnemies(level) {
    return level.repeatAcrossLevelSegments((offset) => {
        return [
            ...createInstances(Chicken, 6, offset, level.getYPositionForObject(100), 100, 100),
            ...createInstances(Chick, 6, offset, level.getYPositionForObject(70), 70, 70),
        ];
    });
}

function createCoins(level) {
    return level.repeatAcrossLevelSegments((offset) => {
        return createInstances(Coin, 2, offset, level.getYPositionForObject(200), 200, 200);
    });
}

function createBottles(level) {
    return level.repeatAcrossLevelSegments((offset) => {
        return createInstances(StandingBottle, 1, offset, level.getYPositionForObject(110), 120, 120);
    });
}