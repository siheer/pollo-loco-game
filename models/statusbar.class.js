export default class Statusbar {
    constructor(id, eventType) {
        this.element = document.getElementById(id);
        document.addEventListener(eventType, (event) => {
            this.calcRemainingOfItemOrHealth(event);
        });
    }

    calcRemainingOfItemOrHealth = (event) => {
        const remainingRatio = event.detail.current / event.detail.max;
        const remainingPercent = remainingRatio * 100;
        this.setPercentage(remainingPercent);
    }

    setPercentage = (percentage) => {
        const shiftBarToLeftBy = 100 - percentage;
        const innerElem = this.element.querySelector('.inner');
        innerElem.style.transform = `translateX( -${shiftBarToLeftBy}% )`;
    }
}