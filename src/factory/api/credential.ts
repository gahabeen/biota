import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryCredential } from '~/types/factory/factory.credential';
import { MethodDispatch, Query } from '~/factory/constructors/method';
import { action } from './action';
import { BiotaFunctionName } from './constructors';

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
        const inputs = { ref };
        // ----
        const query = Query(
          {
            doc: q.Get(q.Var('ref')),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.credential.get';
        const online = { name: BiotaFunctionName('CredentialGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(password) {
        const inputs = { instance, password };
        // ----
        const query = Query(
          {
            doc: q.Create(q.Credentials(), { instance: q.Var('instance'), password: q.Var('password') }),
            action: action(q.Var('ctx'))('insert', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = 'factory.credential.insert';
        const online = { name: BiotaFunctionName('CredentialInsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      update(currentPassword, password) {
        const inputs = { ref, instance, currentPassword, password };
        // ----
        const query = Query(
          {
            doc: q.Update(q.Var('ref'), {
              instance: q.Var('instance'),
              current_password: q.Var('currentPassword'),
              password: q.Var('password'),
            }),
            action: action(q.Var('ctx'))('update', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = 'factory.credential.insert';
        const online = { name: BiotaFunctionName('CredentialUpdate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(password) {
        const inputs = { ref, instance, password };
        // ----
        const query = Query(
          {
            doc: q.Replace(q.Var('ref'), { instance: q.Var('instance'), password: q.Var('password') }),
            action: action(q.Var('ctx'))('replace', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = 'factory.credential.replace';
        const online = { name: BiotaFunctionName('CredentialReplace'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsert(password) {
        const inputs = { ref, password };
        // ----
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Var('ref')),
              credentialApi(q.Var('ref')).replace(q.Var('password')),
              credentialApi(q.Var('ref')).insert(q.Var('password')),
            ),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.credential.repsert';
        const online = { name: BiotaFunctionName('CredentialRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      forget() {
        const inputs = { ref };
        // ----
        const query = Query(
          {
            action: action(q.Var('ctx'))('forget', q.Var('ref')).log(),
            doc: q.Delete(q.Var('ref')),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ----
        const offline = 'factory.credential.forget';
        const online = { name: BiotaFunctionName('CredentialRestore'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      drop() {
        const inputs = { ref };
        // ----
        const query = Query(
          {
            doc: q.If(q.Exists(q.Var('ref')), credentialApi(q.Var('ref')).forget(), false),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.credential.drop';
        const online = { name: BiotaFunctionName('CredentialClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
