export default class Statusbar {
    constructor(id, eventType) {
        this.element = document.getElementById(id);
        this.setInitialState(eventType);
        document.addEventListener(eventType, (event) => {
            this.calcRemainingOfItemOrHealth(event);
        });
    }

    setInitialState(eventType) {
        const { max, current } = Statusbar.getMaxAndCurrent(eventType);
        this.calcRemainingOfItemOrHealth({ detail: { max: max, current: current } });
    }

    static getMaxAndCurrent(eventType) {
        const full = 1;
        switch (eventType) {
            case 'characterEnergyEvent':
                return { max: full, current: full };
            case 'endbossEnergyEvent':
                return { max: full, current: full };
            case 'bottleEvent':
                return { max: window.world.level.character.maxBottleSupply, current: window.world.level.character.bottleSupply };
            case 'coinEvent':
                return { max: window.world.level.character.maxCoinSupply, current: window.world.level.character.coinSupply };
            default:
                throw new Error('Invalid event type: ' + eventType);
        }
    }

    calcRemainingOfItemOrHealth(event) {
        const remainingRatio = event.detail.current / event.detail.max;
        const remainingPercent = remainingRatio * 100;
        this.setPercentage(remainingPercent);
    }

    setPercentage(percentage) {
        const shiftBarToLeftBy = 100 - percentage;
        const innerElem = this.element.querySelector('.inner');
        innerElem.style.transform = `translateX( -${shiftBarToLeftBy}% )`;
    }
}