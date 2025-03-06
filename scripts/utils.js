/**
 * Creates an array of instances of a given class type, each initialized with the provided arguments.
 * @param {Function} ClassType - The class constructor.
 * @param {number} length - The number of instances to create.
 * @param {...*} args - Arguments to pass to the constructor.
 * @returns {Array} Array of created instances.
 */
function createInstances(ClassType, length, ...args) {
    return Array(length).fill(null).map(() => new ClassType(...args));
}

/**
 * Flattens a nested collection into a single array.
 * @param {*} collection - The nested collection (array or object).
 * @param {Function|null} [ClassType=null] - Optional class type to filter instances.
 * @returns {Array} The flattened array.
 */
function flattenToArray(collection, ClassType = null) {
    let resultArray = [];
    flattenToArrayRecursive(resultArray, collection, ClassType);
    return resultArray;
}

/**
 * Helper function to recursively flatten a collection.
 * @param {Array} resultArray - The accumulator array for results.
 * @param {*} collection - The collection to flatten.
 * @param {Function|null} ClassType - Optional class type to filter instances.
 */
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

/**
 * Removes a specified item from a nested array.
 * @param {Array} arr - The nested array.
 * @param {*} item - The item to remove.
 */
function removeItemFromNestedArray(arr, item) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === item) {
            arr.splice(i, 1);
        } else if (Array.isArray(arr[i])) {
            removeItemFromNestedArray(arr[i], item);
        }
    }
}

/**
 * Schedules a callback to be executed after the current game loop.
 * @param {Function} callbackFn - The callback function.
 */
function callAfterCurrentGameLoop(callbackFn) {
    setTimeout(() => {
        callbackFn();
    }, 0);
}