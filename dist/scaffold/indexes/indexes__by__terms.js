"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
exports.indexes__by__terms = {
    name: 'indexes__by__terms',
    source: {
        collection: q.Indexes(),
        fields: {
            terms: q.Query(q.Lambda('index', q.Map(q.Select('terms', q.Var('index'), []), q.Lambda('term', q.If(q.Contains('binding', q.Var('term')), q.Concat(['binding:', q.Select('binding', q.Var('term'), '')], ''), q.Concat(['term:', q.Concat(q.Select('field', q.Var('term'), []), '.')], ''))))))
        }
    },
    terms: [
        {
            binding: 'terms'
        }
    ],
    values: [
        {
            field: ['ref']
        }
    ]
};
//# sourceMappingURL=indexes__by__terms.js.map