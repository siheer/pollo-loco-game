export default class StatusBar {
    constructor(id, eventType, eventCallback) {
        this.element = document.getElementById(id);
        document.addEventListener(eventType, eventCallback);
    }

    setPercentage(percentage) {
        const shiftBarToLeftBy = 100 - percentage;
        const innerElem = this.element.querySelector('.inner');
        innerElem.style.transform = `translateX( -${shiftBarToLeftBy}% )`;
    }
}