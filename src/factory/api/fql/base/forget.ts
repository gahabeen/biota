import { DBFactoryFQLBaseForget } from "~/../types/factory/factory.fql.base";
import { query as q } from "faunadb";

export const forget: DBFactoryFQLBaseForget = {
  document(collection, id) {
    return q.Delete(q.Ref(q.Collection(collection), id));
  },
  database(name) {
    return q.Delete(q.Database(name));
  },
  collection(name: string) {
    return q.Delete(q.Collection(name));
  },
  index(name: string) {
    return q.Delete(q.Index(name));
  },
  udfunction(name: string) {
    return q.Delete(q.Function(name));
  },
  role(name: string) {
    return q.Delete(q.Role(name));
  },
  token(id: FaunaId) {
    return q.Delete(q.Ref(q.Tokens(), id));
  },
  key(id: FaunaId) {
    return q.Delete(q.Ref(q.Keys(), id));
  },
};
