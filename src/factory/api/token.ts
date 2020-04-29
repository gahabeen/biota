import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryToken } from '~/types/factory/factory.token';

import { MethodQuery, MethodDispatch } from '~/factory/constructors/method';
import { BiotaFunctionName, DocumentRef } from './constructors';
import { ResultData, ResultAction } from '~/factory/constructors/result';
import { action } from './action';
import { document } from './document';

// tslint:disable-next-line: only-arrow-functions
export const token: FactoryContext<FactoryToken> = function (context): FactoryToken {
  // tslint:disable-next-line: only-arrow-functions
  return (id = null) => {
    return {
      get() {
        const inputs = { id };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: q.Get(q.Ref(q.Tokens(), q.Var('id'))),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.token.get';
        const online = { name: BiotaFunctionName('TokenGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(options) {
        const inputs = { options };
        // ---
        const query = MethodQuery(
          {
            annotated: ResultData(document(q.Var('ctx'), { prefix: 'Token' })().annotate('insert', q.Select('data', q.Var('options'), {}))),
            doc: q.Create(q.Tokens(), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))().log('insert', DocumentRef(q.Var('doc'))),
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
        const inputs = { id, options };
        // ---
        const query = MethodQuery(
          {
            annotated: ResultData(document(q.Var('ctx'), { prefix: 'Token' })().annotate('update', q.Select('data', q.Var('options'), {}))),
            doc: q.Update(q.Ref(q.Tokens(), q.Var('id')), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))().log('update', DocumentRef(q.Var('doc'))),
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
        const inputs = { id, options };
        // ---
        const query = MethodQuery(
          {
            doc: q.If(
              q.Exists(q.Ref(q.Tokens(), q.Var('id'))),
              token(q.Var('ctx'))(q.Var('id')).update(q.Var('options')),
              token(q.Var('ctx'))(q.Var('id')).insert(q.Var('options')),
            ),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ---
        const offline = 'factory.token.upsert';
        const online = { name: BiotaFunctionName('TokenUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(options) {
        const inputs = { id, options };
        // ---
        const query = MethodQuery(
          {
            current_doc: ResultData(token(q.Var('ctx'))(q.Var('id')).get()),
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
            doc: q.Replace(q.Ref(q.Tokens(), q.Var('id')), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))().log('replace', DocumentRef(q.Var('doc'))),
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
        const inputs = { id, options };
        // ---
        const query = MethodQuery(
          {
            doc: q.If(
              q.Exists(q.Ref(q.Tokens(), q.Var('id'))),
              token(q.Var('ctx'))(q.Var('id')).replace(q.Var('options')),
              token(q.Var('ctx'))(q.Var('id')).insert(q.Var('options')),
            ),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ---
        const offline = 'factory.token.repsert';
        const online = { name: BiotaFunctionName('TokenRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      delete() {
        const inputs = { id };
        // ---
        const query = MethodQuery(
          {
            doc: ResultData(document(q.Var('ctx'), { prefix: 'Token' })(q.Var('id')).validity.delete()),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.token.delete';
        const online = { name: BiotaFunctionName('TokenDelete'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      forget() {
        const inputs = { id };
        // ---
        const query = MethodQuery(
          {
            annotated: ResultData(document(q.Var('ctx'), { prefix: 'Token' })().annotate('forget')),
            annotated_doc: ResultData(token(q.Var('ctx'))(q.Var('id')).upsert(q.Var('annotated'))),
            action: action(q.Var('ctx'))().log('forget', DocumentRef(q.Var('annotated_doc'))),
            doc: q.Delete(q.Ref(q.Tokens(), q.Var('id'))),
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
        const inputs = { id };
        // ---
        const query = MethodQuery(
          {
            doc: q.If(q.Exists(q.Ref(q.Tokens(), q.Var('id'))), token(q.Var('ctx'))(q.Var('id')).forget(), {}),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ---
        const offline = 'factory.token.drop';
        const online = { name: BiotaFunctionName('TokenClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireAt(at) {
        // alias
        const inputs = { id, at };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: ResultData(document(q.Var('ctx'), { prefix: 'Token' })(q.Ref(q.Tokens(), q.Var('id'))).validity.expire(q.Var('at'))),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.token.expireAt';
        const online = { name: BiotaFunctionName('TokenExpireAt'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireIn(delay) {
        // alias
        const inputs = { id, delay };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: ResultData(
              document(q.Var('ctx'), { prefix: 'Token' })(q.Ref(q.Tokens(), q.Var('id'))).validity.expire(
                q.TimeAdd(q.Now(), q.ToNumber(q.Var('delay')), 'milliseconds'),
              ),
            ),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.token.expireIn';
        const online = { name: BiotaFunctionName('TokenExpireIn'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      expireNow() {
        // alias
        const inputs = { id };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: ResultData(document(q.Var('ctx'), { prefix: 'Token' })(q.Ref(q.Tokens(), q.Var('id'))).validity.expire(q.Now())),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.token.expireNow';
        const online = { name: BiotaFunctionName('TokenExpireNow'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      restore() {
        // alias
        const inputs = { id };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: ResultData(document(q.Var('ctx'), { prefix: 'Token' })(q.Ref(q.Tokens(), q.Var('id'))).validity.restore()),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.collection.restore';
        const online = { name: BiotaFunctionName('TokenRestore'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
