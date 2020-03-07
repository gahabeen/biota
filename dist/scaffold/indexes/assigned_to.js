"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
exports.assigned_to = (collection) => ({
    name: `${collection}__by__assigned_to`,
    source: { collection: q.Collection(collection) },
    terms: [{ field: ['data', 'activity', 'assigned_to'] }]
});
//# sourceMappingURL=assigned_to.js.map