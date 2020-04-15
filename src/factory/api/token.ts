import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryToken } from '~/../types/factory/factory.token';
import { DefaultToOjbect } from './ql/defaultTo';
import { Query, MethodDispatch } from '../constructors/method';
import { BiotaFunctionName } from './constructors';
import { ResultData } from '../constructors/result';
import { action } from './action';
import { document } from './document';

// tslint:disable-next-line: only-arrow-functions
export const token: FactoryContext<FactoryToken> = function (context): FactoryToken {
  // tslint:disable-next-line: only-arrow-functions
  return (idOrRefOrInstance) => {
    const instance = q.If(q.IsDoc(idOrRefOrInstance), idOrRefOrInstance, null);
    const ref = q.If(
      q.IsToken(idOrRefOrInstance),
      idOrRefOrInstance,
      q.If(q.IsString(idOrRefOrInstance), q.Ref(q.Tokens(), idOrRefOrInstance), null),
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
        const offline = 'factory.token.get';
        const online = { name: BiotaFunctionName('TokenGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(options) {
        options = DefaultToOjbect(options);
        const inputs = { instance, options };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('insert', q.Select('data', q.Var('options'), {}))),
            doc: q.Create(q.Tokens(), q.Merge(q.Var('options'), { instance: q.Var('instance'), data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('insert', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.token.insert';
        const online = { name: BiotaFunctionName('TokenInsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      update(options) {
        options = DefaultToOjbect(options);
        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('update', q.Select('data', q.Var('options'), {}))),
            doc: q.Update(q.Var('ref'), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('update', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.token.update';
        const online = { name: BiotaFunctionName('TokenUpdate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      upsert(options) {
        options = DefaultToOjbect(options);
        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Var('ref')),
              ResultData(token(q.Var('ref'))(q.Var('ref')).update(q.Var('options'))),
              ResultData(token(q.Var('ref'))(q.Var('ref')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.token.upsert';
        const online = { name: BiotaFunctionName('TokenUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(options) {
        options = DefaultToOjbect(options);
        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            current_doc: ResultData(token(q.Var('ctx'))(q.Var('ref')).get()),
            annotated: ResultData(
              document(q.Var('ctx'))().annotate(
                'replace',
                q.Merge(q.Select('data', q.Var('options'), {}), {
                  _auth: q.Select('_auth', q.Var('current_doc'), {}),
                  _membership: q.Select('_membership', q.Var('current_doc'), {}),
                  _validity: q.Select('_validity', q.Var('current_doc'), {}),
                  _activity: q.Select('_activity', q.Var('current_doc'), {}),
                }),
              ),
            ),
            doc: q.Replace(q.Var('ref'), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('replace', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.token.replace';
        const online = { name: BiotaFunctionName('TokenReplace'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsert(options) {
        options = DefaultToOjbect(options);
        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(ref),
              ResultData(token(q.Var('ctx'))(q.Var('ref')).replace(q.Var('options'))),
              ResultData(token(q.Var('ctx'))(q.Var('ref')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.token.repsert';
        const online = { name: BiotaFunctionName('TokenRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      delete() {
        const inputs = { ref };
        // ---
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.delete()),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.token.delete';
        const online = { name: BiotaFunctionName('TokenDelete'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      forget() {
        const inputs = { ref };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('forget')),
            annotated_doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).upsert(q.Var('annotated'))),
            action: action(q.Var('ctx'))('forget', q.Var('ref')).log(),
            doc: q.Delete(q.Var('ref')),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.token.forget';
        const online = { name: BiotaFunctionName('TokenForget'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      drop() {
        const inputs = { ref };
        // ---
        const query = Query(
          {
            doc: q.If(q.Exists(q.Var('ref')), token(q.Var('ctx'))(q.Var('ref')).forget(), false),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.token.drop';
        const online = { name: BiotaFunctionName('TokenClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
