import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryKey } from '~/types/factory/factory.key';

import { MethodQuery, MethodDispatch } from '~/factory/constructors/method';
import { BiotaFunctionName, DocumentRef } from './constructors';
import { action } from './action';
import { document } from './document';
import { ResultData, ResultAction } from '~/factory/constructors/result';

// tslint:disable-next-line: only-arrow-functions
export const key: FactoryContext<FactoryKey> = function (context): FactoryKey {
  // tslint:disable-next-line: only-arrow-functions
  return (id = null) => {
    //q.Ref(q.Keys(), q.Var('id'))
    return {
      get() {
        const inputs = { id };
        // ↓↓↓↓
        const query = MethodQuery(
          {
            doc: q.Get(q.Ref(q.Keys(), q.Var('id'))),
          },
          q.Var('doc'),
        );
        // ↓↓↓↓
        const offline = 'factory.key.get';
        const online = { name: BiotaFunctionName('KeyGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(options) {
        const inputs = { options };
        // ---
        const query = MethodQuery(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('insert', q.Select('data', q.Var('options'), {}))),
            doc: q.CreateKey(q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))().log('insert', DocumentRef(q.Var('doc'))),
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
        const inputs = { id, options };
        // ---
        const query = MethodQuery(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('update', q.Select('data', q.Var('options'), {}))),
            doc: q.Update(q.Ref(q.Keys(), q.Var('id')), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))().log('update', DocumentRef(q.Var('doc'))),
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
        const inputs = { id, options };
        // ---
        const query = MethodQuery(
          {
            doc: q.If(
              q.Exists(q.Ref(q.Keys(), q.Var('id'))),
              key(q.Var('ctx'))(q.Var('id')).update(q.Var('options')),
              key(q.Var('ctx'))(q.Var('id')).insert(q.Var('options')),
            ),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ---
        const offline = 'factory.key.upsert';
        const online = { name: BiotaFunctionName('KeyUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(options) {
        const inputs = { id, options };
        // ---
        const query = MethodQuery(
          {
            current_doc: ResultData(key(q.Var('ctx'))(q.Var('id')).get()),
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
            doc: q.Replace(q.Ref(q.Keys(), q.Var('id')), q.Merge(q.Var('options'), { data: q.Var('annotated') })),
            action: action(q.Var('ctx'))().log('replace', DocumentRef(q.Var('doc'))),
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
        const inputs = { id, options };
        // ---
        const query = MethodQuery(
          {
            doc: q.If(
              q.Exists(q.Ref(q.Keys(), q.Var('id'))),
              key(q.Var('ctx'))(q.Var('id')).replace(q.Var('options')),
              key(q.Var('ctx'))(q.Var('id')).insert(q.Var('options')),
            ),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ---
        const offline = 'factory.key.repsert';
        const online = { name: BiotaFunctionName('KeyRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      // delete() {
      //   const inputs = { id };
      //   // ---
      //   const query = MethodQuery(
      //     {
      //       doc: ResultData(document(q.Var('ctx'))(q.Ref(q.Keys(), q.Var('id'))).validity.delete()),
      //     },
      //     q.Var('doc'),
      //   );
      //   // ---
      //   const offline = 'factory.key.delete';
      //   const online = { name: BiotaFunctionName('KeyDelete'), role: null };
      //   return MethodDispatch({ context, inputs, query })(offline, online);
      // },
      forget() {
        const inputs = { id };
        // ---
        const query = MethodQuery(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('forget')),
            annotated_doc: ResultData(key(q.Var('ctx'))(q.Var('id')).upsert(q.Var('annotated'))),
            action: action(q.Var('ctx'))().log('forget', DocumentRef(q.Var('annotated_doc'))),
            doc: q.Delete(q.Ref(q.Keys(), q.Var('id'))),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.key.forget';
        const online = { name: BiotaFunctionName('KeyForget'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      revoke() {
        const inputs = { id };
        // ---
        const query = MethodQuery(
          {
            doc: key(q.Var('ctx'))(q.Var('id')).forget(),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ---
        const offline = 'factory.key.revoke';
        const online = { name: BiotaFunctionName('KeyRevoke'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      drop() {
        const inputs = { id };
        // ---
        const query = MethodQuery(
          {
            doc: q.If(q.Exists(q.Ref(q.Keys(), q.Var('id'))), key(q.Var('ctx'))(q.Var('id')).forget(), {}),
          },
          ResultData(q.Var('doc')),
          ResultAction(q.Var('doc')),
        );
        // ---
        const offline = 'factory.key.drop';
        const online = { name: BiotaFunctionName('KeyClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
