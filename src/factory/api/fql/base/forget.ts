import { DBFactoryFQLBaseForget } from '~/../types/factory/factory.fql.base';
import { query as q } from 'faunadb';

export const forget: DBFactoryFQLBaseForget = {
  document(collection, id) {
    return q.Delete(q.Ref(q.Collection(collection), id));
  },
  database(name) {
    return q.Delete(q.Database(name));
  },
  collection(name) {
    return q.Delete(q.Collection(name));
  },
  index(name) {
    return q.Delete(q.Index(name));
  },
  udfunction(name) {
    return q.Delete(q.Function(name));
  },
  role(name) {
    return q.Delete(q.Role(name));
  },
  token(id) {
    return q.Delete(q.Ref(q.Tokens(), id));
  },
  key(id) {
    return q.Delete(q.Ref(q.Keys(), id));
  },
};
