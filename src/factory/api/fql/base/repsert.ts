import { query as q } from 'faunadb';
import { DBFactoryFQLBaseRepsert } from '~/../types/factory/factory.fql.base';
import { insert } from '~/factory/api/fql/base/insert';
import { replace } from '~/factory/api/fql/base/replace';

export const repsert: DBFactoryFQLBaseRepsert = {
  document(collection, id, data = {}) {
    return q.If(
      q.Exists(q.Ref(q.Collection(collection), id)),
      replace.document(collection, id, data),
      insert.document(collection, data, id),
    );
  },
  database(name, options = {}) {
    return q.If(q.Exists(q.Database(name)), replace.database(name, options), insert.database(name, options));
  },
  collection(name, options = {}) {
    return q.If(q.Exists(q.Collection(name)), replace.collection(name, options), insert.collection(name, options));
  },
  index(name, options = {}) {
    return q.If(q.Exists(q.Index(name)), replace.index(name, options), insert.index(name, options));
  },
  udfunction(name, options = {}) {
    return q.If(q.Exists(q.Function(name)), replace.udfunction(name, options), insert.udfunction(name, options));
  },
  role(name, options = {}) {
    return q.If(q.Exists(q.Role(name)), replace.role(name, options), insert.role(name, options));
  },
  token(id, options = {}) {
    return q.If(q.Exists(q.Ref(q.Tokens(), id)), replace.token(id, options), insert.token(options.name, options));
  },
  key(id, options = {}) {
    return q.If(q.Exists(q.Ref(q.Keys(), id)), replace.key(id, options), insert.key(options.name, options));
  },
};
