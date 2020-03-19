"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
const index_1 = require("../methods/index");
const reverse_1 = require("../methods/reverse");
const cursor_1 = require("../methods/cursor");
function IndexActivity(collection) {
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
    const owner_changed_at__reverse = reverse_1.ToReverse(owner_changed_at);
    const assignees = index_1.Index({
        name: `${collection}__by__assignees`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'assignees'] }]
    });
    const assigned_by = index_1.Index({
        name: `${collection}__by__assigned_by`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'assigned_by'] }]
    });
    const assigned_at = index_1.Index({
        name: `${collection}__by__assigned_at`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'assigned_at'] }]
    });
    const assigned_at__cursor = cursor_1.ToCursor(assigned_at);
    const assigned_at__reverse = reverse_1.ToReverse(assigned_at);
    const imported_by = index_1.Index({
        name: `${collection}__by__imported_by`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'imported_by'] }]
    });
    const imported_at = index_1.Index({
        name: `${collection}__by__imported_at`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'imported_at'] }]
    });
    const imported_at__cursor = cursor_1.ToCursor(imported_at);
    const imported_at__reverse = reverse_1.ToReverse(imported_at);
    const created_by = index_1.Index({
        name: `${collection}__by__created_by`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'created_by'] }]
    });
    const created_at = index_1.Index({
        name: `${collection}__by__created_at`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'created_at'] }]
    });
    const created_at__cursor = cursor_1.ToCursor(created_at);
    const created_at__reverse = reverse_1.ToReverse(created_at);
    const updated_by = index_1.Index({
        name: `${collection}__by__updated_by`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'updated_by'] }]
    });
    const udpated_at = index_1.Index({
        name: `${collection}__by__updated_at`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'updated_at'] }]
    });
    const udpated_at__cursor = cursor_1.ToCursor(udpated_at);
    const udpated_at__reverse = reverse_1.ToReverse(udpated_at);
    const replaced_by = index_1.Index({
        name: `${collection}__by__replaced_by`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'replaced_by'] }]
    });
    const replaced_at = index_1.Index({
        name: `${collection}__by__replaced_at`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'replaced_at'] }]
    });
    const replaced_at__cursor = cursor_1.ToCursor(replaced_at);
    const replaced_at__reverse = reverse_1.ToReverse(replaced_at);
    const deleted_by = index_1.Index({
        name: `${collection}__by__deleted_by`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'deleted_by'] }]
    });
    const deleted_at = index_1.Index({
        name: `${collection}__by__deleted_at`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'deleted_at'] }]
    });
    const deleted_at__cursor = cursor_1.ToCursor(deleted_at);
    const deleted_at__reverse = reverse_1.ToReverse(deleted_at);
    const archived_by = index_1.Index({
        name: `${collection}__by__archived_by`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'archived_by'] }]
    });
    const archived_at = index_1.Index({
        name: `${collection}__by__archived_at`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'archived_at'] }]
    });
    const archived_at__cursor = cursor_1.ToCursor(archived_at);
    const archived_at__reverse = reverse_1.ToReverse(archived_at);
    const credentials_changed_by = index_1.Index({
        name: `${collection}__by__credentials_changed_by`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'credentials_changed_by'] }]
    });
    const credentials_changed_at = index_1.Index({
        name: `${collection}__by__credentials_changed_at`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'credentials_changed_at'] }]
    });
    const credentials_changed_at__cursor = cursor_1.ToCursor(credentials_changed_at);
    const credentials_changed_at__reverse = reverse_1.ToReverse(credentials_changed_at);
    const expired_by = index_1.Index({
        name: `${collection}__by__expired_by`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'expired_by'] }]
    });
    const expired_at = index_1.Index({
        name: `${collection}__by__expired_at`,
        source: { collection: q.Collection(collection) },
        terms: [{ field: ['data', 'activity', 'expired_at'] }]
    });
    const expired_at__cursor = cursor_1.ToCursor(expired_at);
    const expired_at__reverse = reverse_1.ToReverse(expired_at);
    return [
        owner,
        owner_changed_by,
        owner_changed_at,
        owner_changed_at__cursor,
        owner_changed_at__reverse,
        assignees,
        assigned_by,
        assigned_at,
        assigned_at__cursor,
        assigned_at__reverse,
        imported_by,
        imported_at,
        imported_at__cursor,
        imported_at__reverse,
        created_by,
        created_at,
        created_at__cursor,
        created_at__reverse,
        updated_by,
        udpated_at,
        udpated_at__cursor,
        udpated_at__reverse,
        replaced_by,
        replaced_at,
        replaced_at__cursor,
        replaced_at__reverse,
        deleted_by,
        deleted_at,
        deleted_at__cursor,
        deleted_at__reverse,
        archived_by,
        archived_at__cursor,
        archived_at__reverse,
        credentials_changed_by,
        credentials_changed_at,
        credentials_changed_at__cursor,
        credentials_changed_at__reverse,
        expired_by,
        expired_at,
        expired_at__cursor,
        expired_at__reverse
    ];
}
exports.IndexActivity = IndexActivity;
//# sourceMappingURL=activity.js.map