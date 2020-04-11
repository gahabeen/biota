import { query as q } from 'faunadb';
import { DBFactoryCallGet } from '~/../types/factory/factory.call';
import { Identity } from '~/factory/api/ql';
import { udfunctionNameNormalized as udfName } from '~/factory/classes/udfunction';
import { DB } from '~/db';

export const get: DBFactoryCallGet = {
  document(this: DB, collection, id, options = {}) {
    return q.Call(udfName('GetDocument'), Identity(), this.private_key, collection, id, options);
  },
  database(this: DB, name) {
    return q.Call(udfName('GetDatabase'), Identity(), this.private_key, name);
  },
  databases(this: DB, pagination) {
    return q.Call(udfName('GetDatabases'), Identity(), this.private_key, pagination);
  },
  collection(this: DB, name) {
    return q.Call(udfName('GetCollection'), Identity(), this.private_key, name);
  },
  collections(this: DB, pagination) {
    return q.Call(udfName('GetCollections'), Identity(), this.private_key, pagination);
  },
  index(this: DB, name) {
    return q.Call(udfName('GetIndex'), Identity(), this.private_key, name);
  },
  indexes(this: DB, pagination) {
    return q.Call(udfName('GetIndexes'), Identity(), this.private_key, pagination);
  },
  udfunction(this: DB, name) {
    return q.Call(udfName('GetUDFunction'), Identity(), this.private_key, name);
  },
  udfunctions(this: DB, pagination) {
    return q.Call(udfName('GetUDFunctions'), Identity(), this.private_key, pagination);
  },
  role(this: DB, name) {
    return q.Call(udfName('GetRole'), Identity(), this.private_key, name);
  },
  roles(this: DB, pagination) {
    return q.Call(udfName('GetRoles'), Identity(), this.private_key, pagination);
  },
  token(this: DB, id) {
    return q.Call(udfName('GetToken'), Identity(), this.private_key, id);
  },
  tokens(this: DB, pagination) {
    return q.Call(udfName('GetTokens'), Identity(), this.private_key, pagination);
  },
  key(this: DB, id) {
    return q.Call(udfName('GetKey'), Identity(), this.private_key, id);
  },
  keys(this: DB, pagination) {
    return q.Call(udfName('GetKeys'), Identity(), this.private_key, pagination);
  },
  credentials(this: DB, pagination) {
    return q.Call(udfName('GetCredentials'), Identity(), this.private_key, pagination);
  },
};
