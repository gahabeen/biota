"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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