import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryDatabase } from '~/types/factory/factory.database';

import { Query, MethodDispatch } from '~/factory/constructors/method';
import { BiotaFunctionName } from './constructors';
import { action } from './action';
import { document } from './document';
import { ResultData } from '~/factory/constructors/result';

// tslint:disable-next-line: only-arrow-functions
export const database: FactoryContext<FactoryDatabase> = function (context): FactoryDatabase {
  // tslint:disable-next-line: only-arrow-functions
  return (name) => {
    const ref = q.Database(name);
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
        const offline = 'factory.database.get';
        const online = { name: BiotaFunctionName('DatabaseGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(options) {

        const inputs = { name, options };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('insert', q.Select('data', q.Var('options'), {}))),
            doc: q.CreateDatabase(q.Merge(q.Var('options'), { name: q.Var('name'), data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('insert', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.database.insert';
        const online = { name: BiotaFunctionName('DatabaseInsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      update(options) {

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
        const offline = 'factory.database.update';
        const online = { name: BiotaFunctionName('DatabaseUpdate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      upsert(options) {

        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Var('ref')),
              database(q.Var('ctx'))(q.Var('ref')).update(q.Var('options')),
              database(q.Var('ctx'))(q.Var('ref')).insert(q.Var('options')),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.database.upsert';
        const online = { name: BiotaFunctionName('DatabaseUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(options) {

        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            current_doc: ResultData(database(q.Var('ctx'))(q.Var('ref')).get()),
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
        const offline = 'factory.database.replace';
        const online = { name: BiotaFunctionName('DatabaseReplace'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsert(options) {

        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Var('ref')),
              ResultData(database(q.Var('ctx'))(q.Var('ref')).replace(q.Var('options'))),
              ResultData(database(q.Var('ctx'))(q.Var('ref')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.database.repsert';
        const online = { name: BiotaFunctionName('DatabaseRepsert'), role: null };
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
        const offline = 'factory.database.delete';
        const online = { name: BiotaFunctionName('DatabaseDelete'), role: null };
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
        const offline = 'factory.database.forget';
        const online = { name: BiotaFunctionName('DatabaseForget'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      drop() {
        const inputs = { ref };
        // ---
        const query = Query(
          {
            doc: q.If(q.Exists(q.Var('ref')), database(q.Var('ctx'))(q.Var('ref')).forget(), false),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.database.drop';
        const online = { name: BiotaFunctionName('DatabaseClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireAt(at) {
        // alias
        const inputs = { ref, at };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.expire(q.Var('at'))),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.database.expireAt';
        const online = { name: BiotaFunctionName('DatabaseExpireAt'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireIn(delay) {
        // alias
        const inputs = { ref, delay };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.expire(q.TimeAdd(q.Now(), q.ToNumber(delay), 'milliseconds'))),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.database.expireIn';
        const online = { name: BiotaFunctionName('DatabaseExpireIn'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireNow() {
        // alias
        const inputs = { ref };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.expire(q.Now())),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.database.expireNow';
        const online = { name: BiotaFunctionName('DatabaseExpireNow'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      restore() {
        // alias
        const inputs = { ref };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'))(q.Var('ref')).validity.restore()),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.database.restore';
        const online = { name: BiotaFunctionName('DatabaseRestore'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
