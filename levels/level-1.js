import Level from "../models/level.class.js";
import Cloud from '../models/cloud.class.js';
import Chick from '../models/chick.class.js';
import Chicken from '../models/chicken.class.js';
import Endboss from '../models/endboss.class.js';

export function getLevelItems(world, repeatCount) {
    return [
        [
            ...Level.getBackgroundSecondPart(world, -world.canvas.width),
            ...Level.getFullBackground(world, repeatCount),
        ],
        [
            new Cloud('./img/5_background/layers/4_clouds/1.png', world.canvas.width / 3, 0, world.canvas.width * 0.7, world.canvas.height * 0.7),
        ],
        new Endboss(world.level.levelEndX, world.getYPositionForObject(600) + 50, 515, 600),
        createInstances(Chicken, 8, world.getYPositionForObject(100), 100, 100),
    ]
}