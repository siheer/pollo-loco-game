import BackgroundObject from '../models/background-object.class.js';

export default class Level {
    constructor(world, pathToLevelItems, levelXLengthFactor = 1) {
        this.world = world;
        this.pathToLevelItems = pathToLevelItems;
        this.levelItems = [];
        this.backgroundParts = 2;
        this.levelXLengthFactor = levelXLengthFactor * this.backgroundParts;
        this.levelEndX = this.world.canvas.width * this.levelXLengthFactor - this.world.canvas.width;
    }

    async fillLevelWithObjects() {
        try {
            const level = await import(this.pathToLevelItems);
            this.levelItems = level.createLevelItems(this.world, this.levelXLengthFactor);
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
        let items = [];
        for (let i = 0; i < count; i++) {
            items.push(...Level.getBackgroundFirstPart(world, world.canvas.width * i));
            items.push(...Level.getBackgroundSecondPart(world, world.canvas.width * ++i));
        }
        return items;
    }

    getRandomXInSegment(segmentIndex) {
        return segmentIndex * this.world.canvas.width + Math.random() * this.world.canvas.width;
    }

    repeatAcrossLevelSegments(callback, repeatCount = this.levelXLengthFactor - 1) {
        let result = [];
        for (let canvasOffset = 1; canvasOffset < repeatCount; canvasOffset++) {
            result.push(callback(canvasOffset));
        }
        return result;
    }
}