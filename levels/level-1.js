import Level from "../models/level.class.js";
import Cloud from '../models/cloud.class.js';
import Chick from '../models/chick.class.js';
import Chicken from '../models/chicken.class.js';
import Endboss from '../models/endboss.class.js';
import Coin from '../models/coin.class.js';
import StandingBottle from "../models/standing-bottle.class.js";

export function createLevelItems(world, repeatCount) {
    const backgrounds = createBackgrounds(world, repeatCount);
    const enemies = createEnemies(world);
    enemies.push(new Endboss(world.level.levelEndX, world.getYPositionForObject(600) + 50, 515, 600));
    const coins = createInstances(Coin, 8, 0, world.getYPositionForObject(200), 200, 200);
    coins.push(...createCoins(world));
    const bottles = createInstances(StandingBottle, 2, 0, world.getYPositionForObject(120), 120, 120);
    bottles.push(...createBottles(world));

    return [
        backgrounds,
        enemies,
        ...coins,
        ...bottles
    ]
}

function createBackgrounds(world, repeatCount) {
    return [
        [
            ...Level.getBackgroundSecondPart(world, -world.canvas.width),
            ...Level.getFullBackground(world, repeatCount),
        ],
        new Cloud('./img/5_background/layers/4_clouds/1.png', 0, 0, world.canvas.width * 0.7, world.canvas.height * 0.7),
        ...world.level.repeatAcrossLevelSegments((offset) => {
            return new Cloud('./img/5_background/layers/4_clouds/1.png', offset, 0, world.canvas.width * 0.7, world.canvas.height * 0.7);
        }),
    ];
}

function createEnemies(world) {
    return world.level.repeatAcrossLevelSegments((offset) => {
        return [
            ...createInstances(Chicken, 8, offset, world.getYPositionForObject(100), 100, 100),
            ...createInstances(Chick, 8, offset, world.getYPositionForObject(70), 70, 70),
        ];
    });
}

function createCoins(world) {
    return world.level.repeatAcrossLevelSegments((offset) => {
        return createInstances(Coin, 8, offset, world.getYPositionForObject(200), 200, 200);
    });
}

function createBottles(world) {
    return world.level.repeatAcrossLevelSegments((offset) => {
        return createInstances(StandingBottle, 2, offset, world.getYPositionForObject(120), 120, 120);
    });
}