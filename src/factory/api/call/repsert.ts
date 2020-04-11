import { query as q } from 'faunadb';
import { DBFactoryCallRepsert } from '~/../types/factory/factory.call';
import { DB } from '~/db';
import { insert } from '~/factory/api/call/insert';
import { replace } from '~/factory/api/call/replace';

export const repsert: DBFactoryCallRepsert = {
  document(this: DB, collection, id, data) {
    return q.If(
      q.Exists(q.Ref(q.Collection(collection), id)),
      replace.document.call(this, collection, id, data),
      insert.document.call(this, collection, data, id),
    );
  },
  database(this: DB, name, options) {
    return q.If(q.Exists(q.Database(name)), replace.database.call(this, name, options), insert.database.call(this, name, options));
  },
  collection(this: DB, name, options) {
    return q.If(q.Exists(q.Collection(name)), replace.collection.call(this, name, options), insert.collection.call(this, name, options));
  },
  index(this: DB, name, options) {
    return q.If(q.Exists(q.Index(name)), replace.index.call(this, name, options), insert.index.call(this, name, options));
  },
  udfunction(this: DB, name, options) {
    return q.If(q.Exists(q.Function(name)), replace.udfunction.call(this, name, options), insert.udfunction.call(this, name, options));
  },
  role(this: DB, name, options) {
    return q.If(q.Exists(q.Role(name)), replace.role.call(this, name, options), insert.role.call(this, name, options));
  },
  token(this: DB, ref, options) {
    // #improve
    return null;
    // return q.If(q.Exists(q.Ref(q.Tokens(), id)), replace.token.call(this, id, options), insert.token.call(this, options.name, options));
  },
  key(this: DB, options) {
    // #improve
    return null;
    // return q.If(q.Exists(q.Ref(q.Keys(), id)), replace.key.call(this, id, options), insert.key.call(this, options.name, options));
  },
};
