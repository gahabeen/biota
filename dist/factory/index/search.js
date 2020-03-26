"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const fauna = require("faunadb");
const q = fauna.query;
// biota
const wrapper_1 = require("./wrapper");
function NGramOnField(depth = 10, field) {
    return q.Union(q.Map(new Array(depth).fill(null).map((_, i) => i + 1), q.Lambda('min', q.NGram(q.LowerCase(q.Select(field, q.Var('instance'))), q.Var('min'), q.Add(1, q.Var('min'))))));
}
exports.NGramOnField = NGramOnField;
function SearchIndex(collection, depth = 10, fields) {
    return wrapper_1.Index({
        name: `${collection}__search_on__${fields.map((field) => field.join('_')).join('_and_')}`,
        source: {
            collection: q.Collection(collection),
            fields: {
                search: q.Query(q.Lambda('instance', q.Distinct(q.Union(fields.map((field) => NGramOnField(depth, field))))))
            }
        },
        terms: [{ binding: 'search' }]
    });
}
exports.SearchIndex = SearchIndex;
//# sourceMappingURL=search.js.map