"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
exports.assignees = (collection) => ({
    name: `${collection}__by__assignees`,
    source: { collection: q.Collection(collection) },
    terms: [{ field: ['data', 'activity', 'assignees'] }]
});
//# sourceMappingURL=assignees.js.map