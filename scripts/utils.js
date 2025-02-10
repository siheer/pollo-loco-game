function createInstances(ClassType, length, ...args) {
    return Array(length).fill(null).map(() => new ClassType(...args));
}

function logCanvas() {
    const canvasElement = document.getElementById('canvas');
    console.log(`Canvas: client width: ${canvasElement.clientWidth}, client height: ${canvasElement.clientHeight}`);
    console.log(`Canvas: width: ${canvasElement.width}, height: ${canvasElement.height}`);
}