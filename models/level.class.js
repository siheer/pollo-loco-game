import BackgroundObject from '../models/background-object.class.js';

export default class Level {
    constructor(world, pathToLevelItems, levelXLengthFactor = 2) {
        this.world = world;
        this.pathToLevelItems = pathToLevelItems;
        this.levelItems = [];
        this.levelXLengthFactor = levelXLengthFactor;
        const backgroundParts = 2;
        this.levelEndX = this.world.canvas.width * backgroundParts * levelXLengthFactor - this.world.canvas.width;
    }

    async fillLevelWithObjects() {
        try {
            const level = await import(this.pathToLevelItems);
            this.levelItems = level.getLevelItems(this.world, this.levelXLengthFactor);
        } catch (error) {
            console.error('Error loading level items:', error);
        }
    }

    static getBackgroundFirstPart(world, shift = 0) {
        return [
            new BackgroundObject('./img/5_background/layers/air.png', shift, 0, world.canvas.width + 1), // +1 to remove a strange line on the left
            new BackgroundObject('./img/5_background/layers/3_third_layer/1.png', shift),
            new BackgroundObject('./img/5_background/layers/2_second_layer/1.png', shift),
            new BackgroundObject('./img/5_background/layers/1_first_layer/1.png', shift),
        ];
    }

    static getBackgroundSecondPart(world, shift = world.canvas.width) {
        return [
            new BackgroundObject('./img/5_background/layers/air.png', shift, 0, world.canvas.width + 1), // +1 to remove a strange line on the left
            new BackgroundObject('./img/5_background/layers/3_third_layer/2.png', shift),
            new BackgroundObject('./img/5_background/layers/2_second_layer/2.png', shift),
            new BackgroundObject('./img/5_background/layers/1_first_layer/2.png', shift),
        ];
    }

    static getFullBackground(world, count) {
        const countOfBackgroundComponents = 2;
        let items = [];
        for (let i = 0; i < count * countOfBackgroundComponents; i++) {
            items.push(...Level.getBackgroundFirstPart(world, world.canvas.width * i));
            items.push(...Level.getBackgroundSecondPart(world, world.canvas.width * ++i));
        }
        return items;
    }
}