function createInstances(ClassType, length, ...args) {
    return Array(length).fill(null).map(() => new ClassType(...args));
}

function logCanvas() {
    const canvasElement = document.getElementById('canvas');
    console.log(`Canvas: client width: ${canvasElement.clientWidth}, client height: ${canvasElement.clientHeight}`);
    console.log(`Canvas: width: ${canvasElement.width}, height: ${canvasElement.height}`);
}

function flattenToArray(collection) {
    let resultArray = [];
    flattenToArrayRecursive(resultArray, collection);
    return resultArray;
}

function flattenToArrayRecursive(resultArray, collection) {
    if (collection) {
        if (Array.isArray(collection)) {
            collection.forEach(item => flattenToArrayRecursive(resultArray, item));
        } else if (collection.constructor === Object) {
            Object.values(collection).forEach(object => flattenToArrayRecursive(resultArray, object));
        } else {
            resultArray.push(collection);
        }
    }
}