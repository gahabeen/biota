import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryCollection } from '~/../types/factory/factory.collection';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const collection: FactoryContext<FactoryCollection> = function (contextExpr): FactoryCollection {
  // tslint:disable-next-line: only-arrow-functions
  return (name) => {
    const collectionApi = collection(contextExpr);
    const ref = q.Collection(name);
    return {
      get() {
        return q.Get(ref);
      },
      insert(options) {
        options = DefaultToOjbect(options);
        return q.CreateCollection(q.Merge(options, { name }));
      },
      update(options) {
        options = DefaultToOjbect(options);
        return q.Update(ref, options);
      },
      upsert(options) {
        return q.If(q.Exists(ref), collectionApi(ref).update(options), collectionApi(ref).insert(options));
      },
      replace(options) {
        options = DefaultToOjbect(options);
        return q.Replace(ref, options);
      },
      repsert(options) {
        return q.If(q.Exists(ref), collectionApi(ref).replace(options), collectionApi(ref).insert(options));
      },
      delete() {
        return '';
      },
      forget() {
        return q.Delete(ref);
      },
      clean() {
        return q.If(q.Exists(ref), collectionApi(ref).forget(), false);
      },
    };
  };
};
