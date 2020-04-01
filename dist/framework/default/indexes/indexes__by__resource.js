"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const fauna = require("faunadb");
const q = fauna.query;
// biota
const index_1 = require("~/factory/classes/index");
exports.indexes__by__resource = index_1.Index({
    name: index_1.indexNameNormalized('indexes__by__resource'),
    source: {
        collection: q.Indexes(),
        fields: {
            source: q.Query(q.Lambda('index', q.Let({
                source: q.Select('source', q.Var('index'), false),
                collection: q.Select('collection', q.Var('source'), false)
            }, q.If(q.IsRef(q.Var('collection')), q.Var('collection'), false))))
        }
    },
    terms: [
        {
            binding: 'source'
        }
    ],
    values: [
        {
            field: ['ref']
        }
    ]
});
//# sourceMappingURL=indexes__by__resource.js.map