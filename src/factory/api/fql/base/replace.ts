import { DBFactoryFQLBaseReplace } from "~/../types/factory/factory.fql.base";
import { query as q } from "faunadb";

export const replace: DBFactoryFQLBaseReplace = {
  document(collection, id, data = {}) {
    return q.Replace(q.Ref(q.Collection(collection), id), data);
  },
  database(name, options = {}) {
    return q.Replace(q.Database(name), options);
  },
  collection(name, options = {}) {
    return q.Replace(q.Collection(name), options);
  },
  index(name, options = {}) {
    return q.Replace(q.Index(name), options);
  },
  udfunction(name, options = {}) {
    return q.Replace(q.Function(name), options);
  },
  role(name, options = {}) {
    return q.Replace(q.Role(name), options);
  },
  token(id, options = {}) {
    return q.Replace(q.Ref(q.Tokens(), id), options);
  },
  key(id, options = {}) {
    return q.Replace(q.Ref(q.Keys(), id), options);
  },
};
