"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const merge = (activity, data = faunadb_1.query.Var("data")) => faunadb_1.query.Merge(data, {
    activity: faunadb_1.query.Merge(faunadb_1.query.Select("activity", data, {}), activity)
});
exports.logData = {
    own: () => merge({
        owner: faunadb_1.query.Var("ref"),
        owner_changed_at: faunadb_1.query.Now(),
        owner_changed_by: faunadb_1.query.Identity()
    }),
    credentials: () => merge({ credentials_changed_by: faunadb_1.query.Var("ref"), credentials_changed_at: faunadb_1.query.Now() }, {}),
    assign: () => merge({ assignees: faunadb_1.query.Var("ref"), assigned_at: faunadb_1.query.Now() }),
    import: () => merge({ imported_by: faunadb_1.query.Identity(), imported_at: faunadb_1.query.Now() }),
    create: () => merge({ created_by: faunadb_1.query.Identity(), created_at: faunadb_1.query.Now() }),
    update: () => merge({ updated_by: faunadb_1.query.Identity(), updated_at: faunadb_1.query.Now() }),
    replace: () => merge({ replaced_by: faunadb_1.query.Identity(), replaced_at: faunadb_1.query.Now() }),
    expire: () => merge({ expired_by: faunadb_1.query.Identity(), expired_at: faunadb_1.query.Var("at") }),
    delete: () => merge({ deleted_by: faunadb_1.query.Identity(), deleted_at: faunadb_1.query.Now() }),
    archive: () => merge({ archived_by: faunadb_1.query.Identity(), archived_at: faunadb_1.query.Now() })
};
//# sourceMappingURL=logData.js.map