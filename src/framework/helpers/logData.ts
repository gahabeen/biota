// types
// external
import { query as q } from "faunadb";
// biota

const merge = (fieldValues: object) => {
  let dataToMerge = {};
  for (let fieldName in fieldValues) {
    dataToMerge[fieldName] = q.Merge(
      q.Select(fieldName, q.Var("data"), {}),
      fieldValues[fieldName]
    );
  }
  return q.Merge(q.Var("data"), dataToMerge);
};

export const logData = {
  own() {
    return merge({
      access: {
        owner: q.Var("ref")
      },
      activity: {
        owner_changed_at: q.Now(),
        owner_changed_by: q.Var("userRef")
      }
    });
  },
  credentials() {
    return merge({
      activity: {
        credentials_changed_by: q.Var("ref"),
        credentials_changed_at: q.Now()
      }
    });
  },
  assign() {
    return merge({
      access: {
        assignees: q.Var("ref")
      },
      activity: { assigned_by: q.Var("userRef"), assigned_at: q.Now() }
    });
  },
  import() {
    return merge({
      activity: { imported_by: q.Var("userRef"), imported_at: q.Now() }
    });
  },
  create() {
    return merge({
      activity: { created_by: q.Var("userRef"), created_at: q.Now() }
    });
  },
  update() {
    return merge({
      activity: { updated_by: q.Var("userRef"), updated_at: q.Now() }
    });
  },
  replace() {
    return merge({
      activity: { replaced_by: q.Var("userRef"), replaced_at: q.Now() }
    });
  },
  expire() {
    return merge({
      activity: { expired_by: q.Var("userRef"), expired_at: q.Var("at") }
    });
  },
  delete() {
    return merge({
      activity: { deleted_by: q.Var("userRef"), deleted_at: q.Now() }
    });
  },
  archive() {
    return merge({
      activity: { archived_by: q.Var("userRef"), archived_at: q.Now() }
    });
  }
};
