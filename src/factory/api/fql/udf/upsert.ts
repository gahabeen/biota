import { query as q } from 'faunadb';
import { DBFactoryFQLUDFUpsert } from '~/../types/factory/factory.fql.udf';
import { udfunctionNameNormalized as udfName } from '~/factory/classes/udfunction';
import { Identity } from '../../ql/identity';
import { indexNameNormalized } from '~/factory/classes';

export const upsert: DBFactoryFQLUDFUpsert = {
  document(collection, id, data = {}) {
    return q.If(
      q.Exists(q.Ref(q.Collection(collection), id)),
      q.Call(udfName('UpdateDocument'), Identity(), q.Var('private_key'), collection, id, data),
      q.Call(udfName('InsertDocument'), Identity(), q.Var('private_key'), collection, data, id),
    );
  },
  database(name, options = {}) {
    return q.If(
      q.Exists(q.Database(name)),
      q.Call(udfName('UpdateDabase'), Identity(), q.Var('private_key'), name, options),
      q.Call(udfName('InsertDatabase'), Identity(), q.Var('private_key'), name, options),
    );
  },
  collection(name, options = {}) {
    return q.If(
      q.Exists(q.Collection(name)),
      q.Call(udfName('UpdateCollection'), Identity(), q.Var('private_key'), name, options),
      q.Call(udfName('InsertCollection'), Identity(), q.Var('private_key'), name, options),
    );
  },
  index(name, options = {}) {
    return q.If(
      q.Exists(q.Index(name)),
      q.Call(udfName('UpdateIndex'), Identity(), q.Var('private_key'), name, options),
      q.Call(udfName('InsertIndex'), Identity(), q.Var('private_key'), name, options),
    );
  },
  udfunction(name, options = {}) {
    return q.If(
      q.Exists(q.Function(name)),
      q.Call(udfName('UpdateUDFunction'), Identity(), q.Var('private_key'), name, options),
      q.Call(udfName('InsertUDFunction'), Identity(), q.Var('private_key'), name, options),
    );
  },
  role(name, options = {}) {
    return q.If(
      q.Exists(q.Role(name)),
      q.Call(udfName('UpdateRole'), Identity(), q.Var('private_key'), name, options),
      q.Call(udfName('InsertRole'), Identity(), q.Var('private_key'), name, options),
    );
  },
  token(ref, options = {}) {
    return q.Let(
      {
        doc: q.Select(0, q.Match(indexNameNormalized('tokens__by__instance'), ref), null),
      },
      q.If(
        q.IsRef(q.Var('doc')),
        q.Call(udfName('UpdateToken'), Identity(), q.Var('private_key'), q.Var('doc'), options),
        q.Call(udfName('InsertToken'), Identity(), q.Var('private_key'), ref, options),
      ),
    );
  },
  key(id, options = {}) {
    // #improve
    return null;
    // return q.If(q.Exists(q.Ref(q.Keys(), id)), replaceCall.key(id, options), insertCall.key(options.name, options));
  },
};
