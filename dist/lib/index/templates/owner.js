"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
exports.owner = (collection) => ({
    name: `${collection}__by__owner`,
    source: { collection: q.Collection(collection) },
    terms: [{ field: ['data', 'activity', 'owner'] }]
});
//# sourceMappingURL=owner.js.map