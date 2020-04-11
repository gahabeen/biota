import { query as q } from 'faunadb';
import { DBFactoryCallUpsert } from '~/../types/factory/factory.call';
import { DB } from '~/db';
import { insert } from '~/factory/api/call/insert';
import { update } from '~/factory/api/call/update';

export const upsert: DBFactoryCallUpsert = {
  document(this: DB, collection, id, data) {
    return q.If(
      q.Exists(q.Ref(q.Collection(collection), id)),
      update.document.call(this, collection, id, data),
      insert.document.call(this, collection, data, id),
    );
  },
  database(this: DB, name, options) {
    return q.If(q.Exists(q.Database(name)), update.database.call(this, name, options), insert.database.call(this, name, options));
  },
  collection(this: DB, name, options) {
    return q.If(q.Exists(q.Collection(name)), update.collection.call(this, name, options), insert.collection.call(this, name, options));
  },
  index(this: DB, name, options) {
    return q.If(q.Exists(q.Index(name)), update.index.call(this, name, options), insert.index.call(this, name, options));
  },
  udfunction(this: DB, name, options) {
    return q.If(q.Exists(q.Function(name)), update.udfunction.call(this, name, options), insert.udfunction.call(this, name, options));
  },
  role(this: DB, name, options) {
    return q.If(q.Exists(q.Role(name)), update.role.call(this, name, options), insert.role.call(this, name, options));
  },
  token(this: DB, ref, options) {
    return null;
    // #improve
    // return q.If(q.Exists(q.Ref(q.Tokens(), id)), update.token.call(this, id, options), insert.token.call(this, id, options));
  },
  key(this: DB, options) {
    return null;
    // #improve
    // return q.If(q.Exists(q.Ref(q.Keys(), id)), update.key.call(this, id, options), insert.key.call(this, options.name, options));
  },
};
