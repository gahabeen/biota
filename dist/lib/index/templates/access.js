"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
const index_1 = require("../methods/index");
function access(collection) {
    return index_1.Index({
        name: `${collection}__access`,
        source: { collection: q.Collection(collection), fields: {
                owner: "",
                assignee: "",
                any: ""
            } },
        terms: [{ field: ['data', 'activity', 'owner'] }]
    });
}
exports.access = access;
//# sourceMappingURL=access.js.map