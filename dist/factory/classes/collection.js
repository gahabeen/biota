"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// biota
const consts_1 = require("~/consts");
function collectionNameNormalized(name) {
    return `${consts_1.CONVENTION.COLLECTION_PREFIX}${collectionNamePlural(name.replace(consts_1.CONVENTION.COLLECTION_PREFIX, ""))}`;
}
exports.collectionNameNormalized = collectionNameNormalized;
function collectionNameSingular(name) {
    return name.endsWith("s") ? name.slice(-1) : name;
}
exports.collectionNameSingular = collectionNameSingular;
function collectionNamePlural(name) {
    return !name.endsWith("s") ? name + "s" : name;
}
exports.collectionNamePlural = collectionNamePlural;
function Collection(collection) {
    let { name, data, history_days, ttl_days } = collection || {};
    return {
        name,
        data,
        history_days,
        ttl_days
    };
}
exports.Collection = Collection;
//# sourceMappingURL=collection.js.map