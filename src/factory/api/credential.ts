import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryCredential } from '~/../types/factory/factory.credential';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const credential: FactoryContext<FactoryCredential> = function (context): FactoryCredential {
  // tslint:disable-next-line: only-arrow-functions
  return (idOrRefOrInstance) => {
    const credentialApi = credential(context);
    const instance = q.If(q.IsDoc(idOrRefOrInstance), idOrRefOrInstance, null);
    const ref = q.If(
      q.IsCredentials(idOrRefOrInstance),
      idOrRefOrInstance,
      q.If(q.IsString(idOrRefOrInstance), q.Ref(q.Credentials(), idOrRefOrInstance), null),
    );

    return {
      get() {
        return q.Get(ref);
      },
      insert(password) {
        return q.Create(q.Credentials(), { instance, password });
      },
      update(currentPassword, password) {
        return q.Update(ref, { instance, current_password: currentPassword, password });
      },
      replace(password) {
        return q.Replace(ref, { instance, password });
      },
      repsert(password) {
        return q.If(q.Exists(ref), credentialApi(ref).replace(password), credentialApi(ref).insert(password));
      },
      // delete() {
      //   return '';
      // },
      forget() {
        return q.Delete(ref);
      },
      clean() {
        return q.If(q.Exists(ref), credentialApi(ref).forget(), false);
      },
    };
  };
};
