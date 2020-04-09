import { query as q } from "faunadb";
import { DBFactoryFQLBaseUpdate } from "~/../types/factory/factory.fql.base";

export const update: DBFactoryFQLBaseUpdate = {
  credentials(collection, id, credentials) {
    return q.Update(q.Ref(q.Collection(collection), id), { credentials });
  },
  document(collection, id, data) {
    return q.Update(q.Ref(q.Collection(collection), id), { data });
  },
  database(nameExpr, optionsExpr) {
    return q.Update(q.Database(nameExpr), q.Merge(optionsExpr, { name: nameExpr }));
  },
  collection(nameExpr, optionsExpr) {
    return q.Update(q.Collection(nameExpr), q.Merge(optionsExpr, { name: nameExpr }));
  },
  index(nameExpr, optionsExpr) {
    let { unique } = optionsExpr;
    return q.Update(q.Index(nameExpr), { nameExpr, unique });
  },
  udfunction(nameExpr, optionsExpr) {
    return q.Update(q.Function(nameExpr), q.Merge(optionsExpr, { name: nameExpr }));
  },
  role(nameExpr, optionsExpr) {
    return q.Update(q.Role(nameExpr), q.Merge(optionsExpr, { name: nameExpr }));
  },
  token(id, optionsExpr) {
    return q.Update(q.Ref(q.Tokens(), id), optionsExpr);
  },
  key(id, optionsExpr) {
    return q.Update(q.Ref(q.Keys(), id), optionsExpr);
  },
};
