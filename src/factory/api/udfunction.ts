import { query as q } from 'faunadb';
import { FactoryContext } from '~/../types/factory/factory.context';
import { FactoryUDFunction } from '~/../types/factory/factory.udfunction';
import { DefaultToOjbect } from './ql/defaultTo';
import { Query, MethodDispatch } from '../constructors/method';
import { BiotaFunctionName } from './constructors';
import { action } from './action';
import { document } from './document';
import { ResultData } from '../constructors/result';

// tslint:disable-next-line: only-arrow-functions
export const udfunction: FactoryContext<FactoryUDFunction> = function (context): FactoryUDFunction {
  // tslint:disable-next-line: only-arrow-functions
  return (name) => {
    const udfunctionApi = udfunction(context);
    const ref = q.Function(name);
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
        const offline = 'factory.udfunction.get';
        const online = { name: BiotaFunctionName('UDFunctionGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(options) {
        options = DefaultToOjbect(options);
        const inputs = { name, options };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('insert', q.Select('data', q.Var('options'), {}))),
            doc: q.CreateFunction(q.Merge(q.Var('options'), { name: q.Var('name'), data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('insert', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.udfunction.insert';
        const online = { name: BiotaFunctionName('UDFunctionInsert'), role: null };
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
        const offline = 'factory.udfunction.update';
        const online = { name: BiotaFunctionName('UDFunctionUpdate'), role: null };
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
              ResultData(udfunction(q.Var('ref'))(q.Var('ref')).update(q.Var('options'))),
              ResultData(udfunction(q.Var('ref'))(q.Var('ref')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.udfunction.upsert';
        const online = { name: BiotaFunctionName('UDFunctionUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(options) {
        options = DefaultToOjbect(options);
        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            current_doc: ResultData(udfunction(q.Var('ctx'))(q.Var('ref')).get()),
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
        const offline = 'factory.udfunction.replace';
        const online = { name: BiotaFunctionName('UDFunctionReplace'), role: null };
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
              ResultData(udfunction(q.Var('ctx'))(q.Var('ref')).replace(q.Var('options'))),
              ResultData(udfunction(q.Var('ctx'))(q.Var('ref')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.udfunction.repsert';
        const online = { name: BiotaFunctionName('UDFunctionRepsert'), role: null };
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
        const offline = 'factory.udfunction.delete';
        const online = { name: BiotaFunctionName('UDFunctionDelete'), role: null };
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
        const offline = 'factory.udfunction.forget';
        const online = { name: BiotaFunctionName('UDFunctionForget'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      drop() {
        const inputs = { ref };
        // ---
        const query = Query(
          {
            doc: q.If(q.Exists(q.Var('ref')), udfunction(q.Var('ctx'))(q.Var('ref')).forget(), false),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.udfunction.drop';
        const online = { name: BiotaFunctionName('UDFunctionClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
