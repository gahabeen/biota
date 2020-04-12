import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryDatabase } from '~/../types/factory/factory.database';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const database: FactoryContext<FactoryDatabase> = function (contextExpr): FactoryDatabase {
  // tslint:disable-next-line: only-arrow-functions
  return (name) => {
    const databaseApi = database(contextExpr);
    const ref = q.Database(name);
    return {
      get() {
        return q.Get(ref);
      },
      insert(options) {
        options = DefaultToOjbect(options);
        return q.CreateDatabase(q.Merge(options, { name }));
      },
      update(options) {
        options = DefaultToOjbect(options);
        return q.Update(ref, options);
      },
      upsert(options) {
        return q.If(q.Exists(ref), databaseApi(ref).update(options), databaseApi(ref).insert(options));
      },
      replace(options) {
        options = DefaultToOjbect(options);
        return q.Replace(ref, options);
      },
      repsert(options) {
        return q.If(q.Exists(ref), databaseApi(ref).replace(options), databaseApi(ref).insert(options));
      },
      delete() {
        return '';
      },
      forget() {
        return q.Delete(ref);
      },
      clean() {
        return q.If(q.Exists(ref), databaseApi(ref).forget(), false);
      },
    };
  };
};
