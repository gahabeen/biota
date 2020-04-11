import { query as q } from 'faunadb';
import { DBFactoryCallExpire } from '~/../types/factory/factory.call';
import { Identity } from '~/factory/api/ql';
import { udfunctionNameNormalized as udfName } from '~/factory/classes/udfunction';
import { DB } from '~/db';

export const expire: DBFactoryCallExpire = {
  documentAt(this: DB, collection, id, at) {
    return q.Call(udfName('ExpireDocumentAt'), Identity(), this.private_key, collection, id, at);
  },
  documentIn(this: DB, collection, id, delayInMs) {
    return q.Call(udfName('ExpireDocumentIn'), Identity(), this.private_key, collection, id, delayInMs);
  },
  documentNow(this: DB, collection, id) {
    return q.Call(udfName('ExpireDocumentNow'), Identity(), this.private_key, collection, id);
  },
};
