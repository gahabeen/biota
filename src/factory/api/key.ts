import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryKey } from '~/types/factory/factory.key';

import { Query, MethodDispatch } from '~/factory/constructors/method';
import { BiotaFunctionName } from './constructors';
import { action } from './action';
import { document } from './document';
import { ResultData } from '~/factory/constructors/result';

// tslint:disable-next-line: only-arrow-functions
export const key: FactoryContext<FactoryKey> = function (context): FactoryKey {
  // tslint:disable-next-line: only-arrow-functions
  return (idOrRef) => {
    const ref = q.If(q.IsKey(idOrRef), idOrRef, q.Ref(q.Keys(), idOrRef));
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
        const offline = 'factory.key.get';
        const online = { name: BiotaFunctionName('KeyGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(options) {
        const inputs = { options };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('insert', q.Select('data', q.Var('options'), {}))),
            doc: q.CreateKey(q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('insert', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.key.insert';
        const online = { name: BiotaFunctionName('KeyInsert'), role: null };
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
        const offline = 'factory.key.update';
        const online = { name: BiotaFunctionName('KeyUpdate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      upsert(options) {
        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Var('ref')),
              ResultData(key(q.Var('ctx'))(q.Var('ref')).update(q.Var('options'))),
              ResultData(key(q.Var('ctx'))(q.Var('ref')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.key.upsert';
        const online = { name: BiotaFunctionName('KeyUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(options) {
        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            current_doc: ResultData(key(q.Var('ctx'))(q.Var('ref')).get()),
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
        const offline = 'factory.key.replace';
        const online = { name: BiotaFunctionName('KeyReplace'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsert(options) {
        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Var('ref')),
              ResultData(key(q.Var('ctx'))(q.Var('ref')).replace(q.Var('options'))),
              ResultData(key(q.Var('ctx'))(q.Var('ref')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.key.repsert';
        const online = { name: BiotaFunctionName('KeyRepsert'), role: null };
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
        const offline = 'factory.key.delete';
        const online = { name: BiotaFunctionName('KeyDelete'), role: null };
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
        const offline = 'factory.key.forget';
        const online = { name: BiotaFunctionName('KeyForget'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      drop() {
        const inputs = { ref };
        // ---
        const query = Query(
          {
            doc: q.If(q.Exists(q.Var('ref')), key(q.Var('ctx'))(q.Var('ref')).forget(), false),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.key.drop';
        const online = { name: BiotaFunctionName('KeyClean'), role: null };
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
        const offline = 'factory.key.expireAt';
        const online = { name: BiotaFunctionName('KeyExpireAt'), role: null };
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
        const offline = 'factory.key.expireIn';
        const online = { name: BiotaFunctionName('KeyExpireIn'), role: null };
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
        const offline = 'factory.key.expireNow';
        const online = { name: BiotaFunctionName('KeyExpireNow'), role: null };
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
        const offline = 'factory.collection.restore';
        const online = { name: BiotaFunctionName('KeyRestore'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
