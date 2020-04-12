import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryKey } from '~/../types/factory/factory.key';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const key: FactoryContext<FactoryKey> = function (contextExpr): FactoryKey {
  // tslint:disable-next-line: only-arrow-functions
  return (idOrRef) => {
    const keyApi = key(contextExpr);
    const ref = q.If(q.IsKey(idOrRef), idOrRef, q.Ref(q.Keys(), idOrRef));
    return {
      get() {
        return q.Get(ref);
      },
      insert(options) {
        options = DefaultToOjbect(options);
        return q.CreateKey(options);
      },
      update(options) {
        options = DefaultToOjbect(options);
        return q.Update(ref, options);
      },
      upsert(options) {
        return q.If(q.Exists(ref), keyApi(ref).update(options), keyApi(ref).insert(options));
      },
      replace(options) {
        options = DefaultToOjbect(options);
        return q.Replace(ref, options);
      },
      repsert(options) {
        return q.If(q.Exists(ref), keyApi(ref).replace(options), keyApi(ref).insert(options));
      },
      delete() {
        return '';
      },
      forget() {
        return q.Delete(ref);
      },
      clean() {
        return q.If(q.Exists(ref), keyApi(ref).forget(), false);
      },
    };
  };
};
