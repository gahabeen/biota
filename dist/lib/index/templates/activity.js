"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
const index_1 = require("../methods/index");
const cursor_1 = require("../methods/cursor");
function activity(collection) {
    const owner = index_1.Index({
        name: `${collection}__by__owner`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'owner'] }]
    });
    const owner_changed_by = index_1.Index({
        name: `${collection}__by__owner_changed_by`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'owner_changed_by'] }]
    });
    const owner_changed_at = index_1.Index({
        name: `${collection}__by__owner_changed_at`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'owner_changed_at'] }]
    });
    const owner_changed_at__cursor = cursor_1.ToCursor(owner_changed_at);
    return [
        owner,
        owner_changed_by,
        owner_changed_at,
        owner_changed_at__cursor,
        index_1.Index({
            name: `${collection}__by__owner_changed_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'owner_changed_at'], reverse: true }, { field: 'ref' }]
        }),
        index_1.Index({
            name: `${collection}__by__imported_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'imported_by'] }]
        }),
        index_1.Index({
            name: `${collection}__by__imported_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'imported_at'] }]
        }),
        index_1.Index({
            name: `${collection}__by__imported_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: cursor_1.Cursor(['data', 'activity', 'imported_at'])
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        }),
        index_1.Index({
            name: `${collection}__by__imported_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'imported_at'], reverse: true }, { field: 'ref' }]
        }),
        {
            name: `${collection}__by__created_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'created_by'] }]
        },
        index_1.Index({
            name: `${collection}__by__created_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'created_at'] }]
        }),
        index_1.Index({
            name: `${collection}__by__created_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: cursor_1.Cursor(['data', 'activity', 'created_at'])
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        }),
        index_1.Index({
            name: `${collection}__by__created_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'created_at'], reverse: true }, { field: 'ref' }]
        }),
        index_1.Index({
            name: `${collection}__by__updated_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'updated_by'] }]
        }),
        index_1.Index({
            name: `${collection}__by__updated_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'updated_at'] }]
        }),
        index_1.Index({
            name: `${collection}__by__updated_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: cursor_1.Cursor(['data', 'activity', 'updated_at'])
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        }),
        index_1.Index({
            name: `${collection}__by__updated_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'updated_at'], reverse: true }, { field: 'ref' }]
        }),
        index_1.Index({
            name: `${collection}__by__replaced_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'replaced_by'] }]
        }),
        index_1.Index({
            name: `${collection}__by__replaced_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'replaced_at'] }]
        }),
        index_1.Index({
            name: `${collection}__by__replaced_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: cursor_1.Cursor(['data', 'activity', 'replaced_at'])
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        }),
        index_1.Index({
            name: `${collection}__by__replaced_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'replaced_at'], reverse: true }, { field: 'ref' }]
        }),
        index_1.Index({
            name: `${collection}__by__deleted_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'deleted_by'] }]
        }),
        index_1.Index({
            name: `${collection}__by__deleted_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'deleted_at'] }]
        }),
        index_1.Index({
            name: `${collection}__by__deleted_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: cursor_1.Cursor(['data', 'activity', 'deleted_at'])
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        }),
        index_1.Index({
            name: `${collection}__by__deleted_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'deleted_at'], reverse: true }, { field: 'ref' }]
        }),
        index_1.Index({
            name: `${collection}__by__archived_by`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'archived_by'] }]
        }),
        index_1.Index({
            name: `${collection}__by__archived_at`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'archived_at'] }]
        }),
        index_1.Index({
            name: `${collection}__by__archived_at__cursor`,
            source: {
                collection: q.Collection(collection),
                fields: {
                    cursor: cursor_1.Cursor(['data', 'activity', 'archived_at'])
                }
            },
            values: [{ binding: 'cursor' }, { field: ['ref'] }]
        }),
        index_1.Index({
            name: `${collection}__by__archived_at__reverse`,
            source: { collection: q.Collection(collection) },
            terms: [{ field: ['data', 'activity', 'archived_at'], reverse: true }, { field: 'ref' }]
        })
    ];
}
exports.activity = activity;
//# sourceMappingURL=activity.js.map