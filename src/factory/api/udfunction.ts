import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryUDFunction } from '~/../types/factory/factory.udfunction';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const udfunction: FactoryContext<FactoryUDFunction> = function (contextExpr): FactoryUDFunction {
  // tslint:disable-next-line: only-arrow-functions
  return (name) => {
    const udfunctionApi = udfunction(contextExpr);
    const ref = q.Function(name);
    return {
      get() {
        return q.Get(ref);
      },
      insert(options) {
        options = DefaultToOjbect(options);
        return q.CreateFunction(q.Merge(options, { name }));
      },
      update(options) {
        options = DefaultToOjbect(options);
        return q.Update(ref, options);
      },
      upsert(options) {
        return q.If(q.Exists(ref), udfunctionApi(ref).update(options), udfunctionApi(ref).insert(options));
      },
      replace(options) {
        options = DefaultToOjbect(options);
        return q.Replace(ref, options);
      },
      repsert(options) {
        return q.If(q.Exists(ref), udfunctionApi(ref).replace(options), udfunctionApi(ref).insert(options));
      },
      delete() {
        return '';
      },
      forget() {
        return q.Delete(ref);
      },
      clean() {
        return q.If(q.Exists(ref), udfunctionApi(ref).forget(), false);
      },
    };
  };
};
