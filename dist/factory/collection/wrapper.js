"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function BiotaCollectionName(name) {
    return `biota.${CollectionNamePlural(name.replace("biota.", ""))}`;
}
exports.BiotaCollectionName = BiotaCollectionName;
function CollectionNameSingular(name) {
    return name.endsWith("s") ? name.slice(-1) : name;
}
exports.CollectionNameSingular = CollectionNameSingular;
function CollectionNamePlural(name) {
    return !name.endsWith("s") ? name + "s" : name;
}
exports.CollectionNamePlural = CollectionNamePlural;
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
//# sourceMappingURL=wrapper.js.map