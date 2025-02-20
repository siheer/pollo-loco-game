import Level from "../models/level.class.js";
import Cloud from '../models/cloud.class.js';
import Chick from '../models/chick.class.js';
import Chicken from '../models/chicken.class.js';
import Endboss from '../models/endboss.class.js';

export function getLevelItems(world, repeatCount) {
    const backgrounds = getBackgrounds(world, repeatCount);
    const enemies = getEnemies(world);
    enemies.push(new Endboss(world.level.levelEndX, world.getYPositionForObject(600) + 50, 515, 600));

    return [
        backgrounds,
        enemies,
    ]
}

function getBackgrounds(world, repeatCount) {
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

function getEnemies(world) {
    return world.level.repeatAcrossLevelSegments((offset) => {
        return [
            ...createInstances(Chicken, 8, offset, world.getYPositionForObject(100), 100, 100),
            ...createInstances(Chick, 8, offset, world.getYPositionForObject(70), 70, 70),
        ];
    });
}