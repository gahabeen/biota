import { query as q } from "faunadb";

export const logData = (fieldValues: object, data = {}) => {
  let dataToMerge = {};
  for (let fieldName in fieldValues) {
    dataToMerge[fieldName] = q.Merge(q.Select(fieldName, data, {}), fieldValues[fieldName]);
  }
  return q.Merge(data, dataToMerge);
};

export const logDataOld = {
  own() {
    return logData({
      access: {
        owner: q.Var("ref"),
      },
      activity: {
        owner_changed_at: q.Now(),
        owner_changed_by: q.Var("userRef"),
      },
    });
  },
  credentials() {
    return logData(
      {
        activity: {
          credentials_changed_by: q.Var("ref"),
          credentials_changed_at: q.Now(),
        },
      },
      {}
    );
  },
  assign() {
    return logData({
      access: {
        assignees: q.Var("ref"),
      },
      activity: { assigned_by: q.Var("userRef"), assigned_at: q.Now() },
    });
  },
  insert() {
    return logData({
      activity: { created_by: q.Var("userRef"), created_at: q.Now() },
    });
  },
  update() {
    return logData({
      activity: { updated_by: q.Var("userRef"), updated_at: q.Now() },
    });
  },
  replace() {
    return logData({
      activity: { replaced_by: q.Var("userRef"), replaced_at: q.Now() },
    });
  },
  expire() {
    return logData(
      {
        activity: { expired_by: q.Var("userRef"), expired_at: q.Var("at") },
      },
      {}
    );
  },
  delete() {
    return logData(
      {
        activity: { deleted_by: q.Var("userRef"), deleted_at: q.Now() },
      },
      {}
    );
  },
  archive() {
    return logData(
      {
        activity: { archived_by: q.Var("userRef"), archived_at: q.Now() },
      },
      {}
    );
  },
};
