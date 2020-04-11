import { query as q } from 'faunadb';
import { DBFactoryCallClean } from '~/../types/factory/factory.call';
import { Identity } from '~/factory/api/ql';
import { udfunctionNameNormalized as udfName } from '~/factory/classes/udfunction';
import { DB } from '~/db';

export const clean: DBFactoryCallClean = {
  document(this: DB, collection, id) {
    return q.Call(udfName('CleanDocument'), Identity(), this.private_key, collection, id);
  },
  documents(this: DB, collection) {
    return q.Call(udfName('CleanDocuments'), Identity(), this.private_key, collection);
  },
  database(this: DB, name) {
    return q.Call(udfName('CleanDatabase'), Identity(), this.private_key, name);
  },
  databases(this: DB) {
    return q.Call(udfName('CleanDatabases'), Identity(), this.private_key);
  },
  collection(this: DB, name) {
    return q.Call(udfName('CleanCollection'), Identity(), this.private_key, name);
  },
  collections(this: DB) {
    return q.Call(udfName('CleanCollections'), Identity(), this.private_key);
  },
  index(this: DB, name) {
    return q.Call(udfName('CleanIndex'), Identity(), this.private_key, name);
  },
  indexes(this: DB) {
    return q.Call(udfName('CleanIndexes'), Identity(), this.private_key);
  },
  udfunction(this: DB, name) {
    return q.Call(udfName('CleanUDFunction'), Identity(), this.private_key, name);
  },
  udfunctions(this: DB) {
    return q.Call(udfName('CleanUDFunctions'), Identity(), this.private_key);
  },
  role(this: DB, name) {
    return q.Call(udfName('CleanRole'), Identity(), this.private_key, name);
  },
  roles(this: DB) {
    return q.Call(udfName('CleanRoles'), Identity(), this.private_key);
  },
  token(this: DB, id) {
    return q.Call(udfName('CleanToken'), Identity(), this.private_key, id);
  },
  tokens(this: DB) {
    return q.Call(udfName('CleanTokens'), Identity(), this.private_key);
  },
  key(this: DB, id) {
    return q.Call(udfName('CleanKey'), Identity(), this.private_key, id);
  },
  keys(this: DB) {
    return q.Call(udfName('CleanKeys'), Identity(), this.private_key);
  },
};
