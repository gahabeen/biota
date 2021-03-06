import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryIndex } from '~/types/factory/factory.index';

import { Query, MethodDispatch } from '~/factory/constructors/method';
import { BiotaFunctionName } from './constructors';
import { action } from './action';
import { document } from './document';
import { ResultData } from '~/factory/constructors/result';

// tslint:disable-next-line: only-arrow-functions
export const index: FactoryContext<FactoryIndex> = function (context): FactoryIndex {
  // tslint:disable-next-line: only-arrow-functions
  return (name) => {
    return {
      get() {
        const inputs = { name };
        // ----
        const query = Query(
          {
            doc: q.Get(q.Index(q.Var('name'))),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.index.get';
        const online = { name: BiotaFunctionName('IndexGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(options) {
        const inputs = { name, options };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'), { prefix: 'Index' })().annotate('insert', q.Select('data', q.Var('options'), {}))),
            doc: q.CreateIndex(q.Merge(q.Var('options'), { name: q.Var('name'), data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('insert', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.index.insert';
        const online = { name: BiotaFunctionName('IndexInsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      update(options) {
        const inputs = { name, options };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'), { prefix: 'Index' })().annotate('update', q.Select('data', q.Var('options'), {}))),
            doc: q.Update(q.Index(q.Var('name')), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('update', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.index.update';
        const online = { name: BiotaFunctionName('IndexUpdate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      upsert(options) {
        const inputs = { name, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Index(q.Var('name'))),
              ResultData(index(q.Var('ctx'))(q.Var('name')).update(q.Var('options'))),
              ResultData(index(q.Var('ctx'))(q.Var('name')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.index.upsert';
        const online = { name: BiotaFunctionName('IndexUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(options) {
        const inputs = { name, options };
        // ---
        const query = Query(
          {
            current_doc: ResultData(index(q.Var('ctx'))(q.Var('name')).get()),
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
            doc: q.Replace(q.Index(q.Var('name')), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('replace', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.index.replace';
        const online = { name: BiotaFunctionName('IndexReplace'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsert(options) {
        const inputs = { name, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Index(q.Var('name'))),
              ResultData(index(q.Var('ctx'))(q.Var('name')).replace(q.Var('options'))),
              ResultData(index(q.Var('ctx'))(q.Var('name')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.index.repsert';
        const online = { name: BiotaFunctionName('IndexRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      delete() {
        const inputs = { name };
        // ---
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'), { prefix: 'Index' })(q.Index(q.Var('name'))).validity.delete()),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.index.delete';
        const online = { name: BiotaFunctionName('IndexDelete'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      forget() {
        const inputs = { name };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'), { prefix: 'Index' })().annotate('forget')),
            annotated_doc: ResultData(index(q.Var('ctx'))(q.Var('name')).upsert(q.Var('annotated'))),
            action: action(q.Var('ctx'))('forget', q.Var('name')).log(),
            doc: q.Delete(q.Var('name')),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.index.forget';
        const online = { name: BiotaFunctionName('IndexForget'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      drop() {
        const inputs = { name };
        // ---
        const query = Query(
          {
            doc: q.If(q.Exists(q.Index(q.Var('name'))), index(q.Var('ctx'))(q.Var('name')).forget(), false),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.index.drop';
        const online = { name: BiotaFunctionName('IndexClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireAt(at) {
        // alias
        const inputs = { name, at };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'), { prefix: 'Index' })(q.Var('name')).validity.expire(q.Var('at'))),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.index.expireAt';
        const online = { name: BiotaFunctionName('IndexExpireAt'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireIn(delay) {
        // alias
        const inputs = { name, delay };
        // ----
        const query = Query(
          {
            doc: ResultData(
              document(q.Var('ctx'), { prefix: 'Index' })(q.Var('name')).validity.expire(
                q.TimeAdd(q.Now(), q.ToNumber(q.Var('delay')), 'milliseconds'),
              ),
            ),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.index.expireIn';
        const online = { name: BiotaFunctionName('IndexExpireIn'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireNow() {
        // alias
        const inputs = { name };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'), { prefix: 'Index' })(q.Var('name')).validity.expire(q.Now())),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.index.expireNow';
        const online = { name: BiotaFunctionName('IndexExpireNow'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      restore() {
        // alias
        const inputs = { name };
        // ----
        const query = Query(
          {
            doc: ResultData(document(q.Var('ctx'), { prefix: 'Index' })(q.Var('name')).validity.restore()),
          },
          q.Var('doc'),
        );
        // ----
        const offline = 'factory.collection.restore';
        const online = { name: BiotaFunctionName('IndexRestore'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
