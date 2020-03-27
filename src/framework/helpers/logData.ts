// types
// external
import { query as q } from "faunadb";
// biota

// q.Var("data")
const merge = (activity, data = {}) =>
  q.Merge(data, {
    activity: q.Merge(q.Select("activity", data, {}), activity)
  });

export const logData = {
  own: () =>
    merge({
      owner: q.Var("ref"),
      owner_changed_at: q.Now(),
      owner_changed_by: q.Identity()
    }),
  credentials: () =>
    merge(
      { credentials_changed_by: q.Var("ref"), credentials_changed_at: q.Now() },
      {}
    ),
  assign: () => merge({ assignees: q.Var("ref"), assigned_at: q.Now() }),
  import: () => merge({ imported_by: q.Identity(), imported_at: q.Now() }),
  create: () => merge({ created_by: q.Identity(), created_at: q.Now() }),
  update: () => merge({ updated_by: q.Identity(), updated_at: q.Now() }),
  replace: () => merge({ replaced_by: q.Identity(), replaced_at: q.Now() }),
  expire: () => merge({ expired_by: q.Identity(), expired_at: q.Var("at") }),
  delete: () => merge({ deleted_by: q.Identity(), deleted_at: q.Now() }),
  archive: () => merge({ archived_by: q.Identity(), archived_at: q.Now() })
};
