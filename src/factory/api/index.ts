import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryIndex } from '~/../types/factory/factory.index';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const index: FactoryContext<FactoryIndex> = function (context): FactoryIndex {
  // tslint:disable-next-line: only-arrow-functions
  return (name) => {
    const indexApi = index(context);
    const ref = q.Index(name);
    return {
      get() {
        return q.Get(ref);
      },
      insert(options) {
        options = DefaultToOjbect(options);
        return q.CreateIndex(q.Merge(options, { name }));
      },
      update(options) {
        options = DefaultToOjbect(options);
        return q.Update(ref, options);
      },
      upsert(options) {
        return q.If(q.Exists(ref), indexApi(ref).update(options), indexApi(ref).insert(options));
      },
      replace(options) {
        options = DefaultToOjbect(options);
        return q.Replace(ref, options);
      },
      repsert(options) {
        return q.If(q.Exists(ref), indexApi(ref).replace(options), indexApi(ref).insert(options));
      },
      delete() {
        return '';
      },
      forget() {
        return q.Delete(ref);
      },
      clean() {
        return q.If(q.Exists(ref), indexApi(ref).forget(), false);
      },
    };
  };
};
