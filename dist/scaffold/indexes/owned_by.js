"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
exports.owned_by = (collection) => ({
    name: `${collection}__by__owned_by`,
    source: { collection: q.Collection(collection) },
    terms: [{ field: ['data', 'activity', 'owned_by'] }]
});
//# sourceMappingURL=owned_by.js.map