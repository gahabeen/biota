"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
function intanceActivities(collection) {
    return [
        {
            name: `${collection}__by__owned_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'owned_by'] }]
        },
        {
            name: `${collection}__by__owner_changed_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'owner_changed_by'] }]
        },
        {
            name: `${collection}__by__owner_changed_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'owner_changed_at'] }]
        },
        {
            name: `${collection}__by__owner_changed_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: q.Query(q.Lambda('doc', q.Select(['data', 'activity', 'changed_at'], q.Var('doc'), Infinity)))
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        },
        {
            name: `${collection}__by__owner_changed_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'owner_changed_at'], reverse: true }, { field: 'ref' }]
        },
        {
            name: `${collection}__by__imported_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'imported_by'] }]
        },
        {
            name: `${collection}__by__imported_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'imported_at'] }]
        },
        {
            name: `${collection}__by__imported_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: q.Query(q.Lambda('doc', q.Select(['data', 'activity', 'imported_at'], q.Var('doc'), Infinity)))
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        },
        {
            name: `${collection}__by__imported_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'imported_at'], reverse: true }, { field: 'ref' }]
        },
        {
            name: `${collection}__by__created_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'created_by'] }]
        },
        {
            name: `${collection}__by__created_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'created_at'] }]
        },
        {
            name: `${collection}__by__created_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: q.Query(q.Lambda('doc', q.Select(['data', 'activity', 'created_at'], q.Var('doc'), Infinity)))
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        },
        {
            name: `${collection}__by__created_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'created_at'], reverse: true }, { field: 'ref' }]
        },
        {
            name: `${collection}__by__updated_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'updated_by'] }]
        },
        {
            name: `${collection}__by__updated_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'updated_at'] }]
        },
        {
            name: `${collection}__by__updated_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: q.Query(q.Lambda('doc', q.Select(['data', 'activity', 'updated_at'], q.Var('doc'), Infinity)))
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        },
        {
            name: `${collection}__by__updated_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'updated_at'], reverse: true }, { field: 'ref' }]
        },
        {
            name: `${collection}__by__replaced_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'replaced_by'] }]
        },
        {
            name: `${collection}__by__replaced_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'replaced_at'] }]
        },
        {
            name: `${collection}__by__replaced_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: q.Query(q.Lambda('doc', q.Select(['data', 'activity', 'replaced_at'], q.Var('doc'), Infinity)))
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        },
        {
            name: `${collection}__by__replaced_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'replaced_at'], reverse: true }, { field: 'ref' }]
        },
        {
            name: `${collection}__by__deleted_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'deleted_by'] }]
        },
        {
            name: `${collection}__by__deleted_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'deleted_at'] }]
        },
        {
            name: `${collection}__by__deleted_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: q.Query(q.Lambda('doc', q.Select(['data', 'activity', 'deleted_at'], q.Var('doc'), Infinity)))
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        },
        {
            name: `${collection}__by__deleted_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'deleted_at'], reverse: true }, { field: 'ref' }]
        },
        {
            name: `${collection}__by__archived_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'archived_by'] }]
        },
        {
            name: `${collection}__by__archived_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'archived_at'] }]
        },
        {
            name: `${collection}__by__archived_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: q.Query(q.Lambda('doc', q.Select(['data', 'activity', 'archived_at'], q.Var('doc'), Infinity)))
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        },
        {
            name: `${collection}__by__archived_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'archived_at'], reverse: true }, { field: 'ref' }]
        }
    ];
}
exports.intanceActivities = intanceActivities;
//# sourceMappingURL=document_activities.js.map