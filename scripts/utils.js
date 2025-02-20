function createInstances(ClassType, length, ...args) {
    return Array(length).fill(null).map(() => new ClassType(...args));
}

// function logCanvas() {
//     const canvasElement = document.getElementById('canvas');
//     console.log(`Canvas: client width: ${canvasElement.clientWidth}, client height: ${canvasElement.clientHeight}`);
//     console.log(`Canvas: width: ${canvasElement.width}, height: ${canvasElement.height}`);
// }

// set ClassType if you want to extract only instances of this class
function flattenToArray(collection, ClassType = null) {
    let resultArray = [];
    flattenToArrayRecursive(resultArray, collection, ClassType);
    return resultArray;
}

function flattenToArrayRecursive(resultArray, collection, ClassType) {
    if (collection) {
        if (Array.isArray(collection)) {
            collection.forEach(item => flattenToArrayRecursive(resultArray, item, ClassType));
        } else if (collection.constructor === Object) {
            Object.values(collection).forEach(object => flattenToArrayRecursive(resultArray, object, ClassType));
        } else if (!ClassType) {
            resultArray.push(collection);
        } else if (ClassType && collection instanceof ClassType) {
            resultArray.push(collection);
        }
    }
}

function removeItemFromNestedArray(arr, item) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === item) {
            arr.splice(i, 1);
        } else if (Array.isArray(arr[i])) {
            removeItemFromNestedArray(arr[i], item);
        }
    }
}

function callAfterCurrentGameLoop(callbackFn) {
    setTimeout(() => {
        callbackFn();
    }, 0);
}