import { query as q } from 'faunadb';
import { DBFactoryFQLBaseInsert } from '~/../types/factory/factory.fql.base';

export const insert: DBFactoryFQLBaseInsert = {
  document(collection, data, id) {
    return q.Create(q.If(q.IsString(id), q.Ref(q.Collection(collection), id), q.Collection(collection)), { data });
  },
  database(nameExpr, optionsExpr) {
    return q.CreateDatabase(q.Merge(optionsExpr, { name: nameExpr }));
  },
  collection(nameExpr, optionsExpr) {
    return q.CreateCollection(q.Merge(optionsExpr, { name: nameExpr }));
  },
  index(nameExpr, optionsExpr) {
    return q.CreateIndex(q.Merge(optionsExpr, { name: nameExpr }));
  },
  udfunction(nameExpr, optionsExpr) {
    return q.CreateFunction(q.Merge(optionsExpr, { name: nameExpr }));
  },
  role(nameExpr, optionsExpr) {
    return q.CreateRole(q.Merge(optionsExpr, { name: nameExpr }));
  },
  token(ref, optionsExpr) {
    return q.Create(q.Tokens(), q.Merge(optionsExpr, { instance: ref }));
  },
  key(nameExpr, optionsExpr) {
    return q.CreateKey(q.Merge(optionsExpr, { name: nameExpr }));
  },
};
