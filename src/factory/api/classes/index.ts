import { DBFactoryIndexApi } from '~/../types/factory/factory.classes';
import * as call from '~/factory/api/call';
import { DB } from '~/db';

export const index: DBFactoryIndexApi = {
  all(this: DB) {
    return call.get.indexes.call(this);
  },
  cleanAll(this: DB) {
    return call.clean.indexes.call(this);
  },
  get(this: DB, name) {
    return call.get.index.call(this, name);
  },
  insert(this: DB, name, options) {
    return call.insert.index.call(this, name, options);
  },
  update(this: DB, name, options) {
    return call.update.index.call(this, name, options);
  },
  replace(this: DB, name, options) {
    return call.replace.index.call(this, name, options);
  },
  upsert(this: DB, name, options) {
    return call.upsert.index.call(this, name, options);
  },
  repsert(this: DB, name, options) {
    return call.repsert.index.call(this, name, options);
  },
  delete(this: DB, name) {
    return call.delete.index.call(this, name);
  },
  forget(this: DB, name) {
    return call.forget.index.call(this, name);
  },
};
