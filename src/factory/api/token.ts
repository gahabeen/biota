import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryToken } from '~/../types/factory/factory.token';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const token: FactoryContext<FactoryToken> = function (contextExpr): FactoryToken {
  // tslint:disable-next-line: only-arrow-functions
  return (idOrRefOrInstance) => {
    const tokenApi = token(contextExpr);
    const instance = q.If(q.IsDoc(idOrRefOrInstance), idOrRefOrInstance, null);
    const ref = q.If(
      q.IsToken(idOrRefOrInstance),
      idOrRefOrInstance,
      q.If(q.IsString(idOrRefOrInstance), q.Ref(q.Tokens(), idOrRefOrInstance), null),
    );
    return {
      get() {
        return q.Get(ref);
      },
      insert(options) {
        options = DefaultToOjbect(options);
        return q.Create(q.Tokens(), q.Merge(options, { instance }));
      },
      update(options) {
        options = DefaultToOjbect(options);
        return q.Update(ref, options);
      },
      upsert(options) {
        return q.If(q.Exists(ref), tokenApi(ref).update(options), tokenApi(ref).insert(options));
      },
      replace(options) {
        options = DefaultToOjbect(options);
        return q.Replace(ref, options);
      },
      repsert(options) {
        return q.If(q.Exists(ref), tokenApi(ref).replace(options), tokenApi(ref).insert(options));
      },
      delete() {
        return '';
      },
      forget() {
        return q.Delete(ref);
      },
      clean() {
        return q.If(q.Exists(ref), tokenApi(ref).forget(), false);
      },
    };
  };
};
