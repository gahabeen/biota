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
  assign() {
    return logData({
      access: {
        assignees: q.Var("ref"),
      },
      activity: { assigned_by: q.Var("userRef"), assigned_at: q.Now() },
    });
  },
};
