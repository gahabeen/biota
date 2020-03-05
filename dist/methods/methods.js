"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
function reference({ collection, id, ref } = {}) {
    return ref ? ref : id ? q.Ref(q.Collection(collection), id) : q.Collection(collection);
}
exports.reference = reference;
function activity(data = {}) {
    if (!data.activity)
        data.activity = {};
    const merge = (activity) => ({ ...data, activity: { ...data.activity, ...activity } });
    return {
        owner: (ref) => merge({ owned_by: ref, owner_changed_at: q.Now(), owner_changed_by: q.Identity() }),
        assign: (ref) => merge({ assigned_to: ref, assigned_at: q.Now() }),
        import: (ref) => merge({ imported_by: q.Identity(), imported_at: q.Now() }),
        create: () => merge({ created_by: q.Identity(), created_at: q.Now() }),
        update: () => merge({ updated_by: q.Identity(), updated_at: q.Now() }),
        replace: () => merge({ replaced_by: q.Identity(), replaced_at: q.Now() }),
        expire: () => merge({ expired_by: q.Identity(), expired_at: q.Now() }),
        delete: () => merge({ deleted_by: q.Identity(), deleted_at: q.Now() }),
        archive: () => merge({ archived_by: q.Identity(), archived_at: q.Now() })
    };
}
exports.activity = activity;
//# sourceMappingURL=methods.js.map