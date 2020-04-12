import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryUserSession } from '~/../types/factory/factory.userSession';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const userSession: FactoryContext<FactoryUserSession> = function (contextExpr): FactoryUserSession {
  // tslint:disable-next-line: only-arrow-functions
  return (idOrRefOrUser) => {
    const userSessionApi = userSession(contextExpr);
    // const ref =
    return {
      // get() {
      //   return q.Get(ref);
      // },
      // insert(options) {
      //   options = DefaultToOjbect(options);
      //   return q.CreateUserSession(q.Merge(options, { name }));
      // },
      // update(options) {
      //   options = DefaultToOjbect(options);
      //   return q.Update(ref, options);
      // },
      // upsert(options) {
      //   return q.If(q.Exists(ref), userSessionApi(ref).update(options), userSessionApi(ref).insert(options));
      // },
      // replace(options) {
      //   options = DefaultToOjbect(options);
      //   return q.Replace(ref, options);
      // },
      // repsert(options) {
      //   return q.If(q.Exists(ref), userSessionApi(ref).replace(options), userSessionApi(ref).insert(options));
      // },
      // delete() {
      //   return '';
      // },
      // forget() {
      //   return q.Delete(ref);
      // },
      // clean() {
      //   return q.If(q.Exists(ref), userSessionApi(ref).forget(), false);
      // },
    };
  };
};
