/**
 * Preloads images via decoding to remove stutters on first game startup
 * @param {Promise} promise - the decoding promise
 */
export default class WorldImagePreloader {
    static _promises = [];

    static add(imagePromise) {
        WorldImagePreloader._promises.push(imagePromise.catch(() => { }));
    }

    static async preload() {
        await Promise.all(WorldImagePreloader._promises);
        WorldImagePreloader._promises = [];
    }
}
