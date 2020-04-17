import { query as q } from 'faunadb';
import { FactoryCollection } from '~/../types/factory/factory.collection';
import { FactoryContext } from '~/../types/factory/factory.context';
import { action } from '~/factory/api/action';
import { MethodDispatch, Query } from '../constructors/method';
import { ResultData } from '../constructors/result';
import { BiotaFunctionName } from '../constructors/udfunction';
import { ContextExtend } from './constructors';

import { document } from '~/factory/api/document';

// tslint:disable-next-line: only-arrow-functions
export const collection: FactoryContext<FactoryCollection> = function (context): FactoryCollection {
  // tslint:disable-next-line: only-arrow-functions
  return (name = null) => {
    const ref = q.Collection(name);
    return {
      findAll(pagination = {}) {

        const inputs = { pagination };
        // ---
        const query = Query(
          {
            docs: q.Map(q.Paginate(q.Documents(q.Var('ref')), q.Var('pagination')), q.Lambda('x', q.Get(q.Var('x')))),
          },
          q.Var('docs'),
        );
        // ---
        const offline = 'factory.collection.paginate';
        const online = { name: BiotaFunctionName('CollectionPaginate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      get() {
        const inputs = { ref };
        // ---
        const query = Query(
          {
            doc: q.Get(q.Var('ref')),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.collection.get';
        const online = { name: BiotaFunctionName('CollectionGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(options) {

        const inputs = { name, options };
        // ---
        const query = Query(
          {
            annotated: ResultData(document(q.Var('ctx'))().annotate('insert', q.Select('data', q.Var('options'), {}))),
            doc: q.CreateCollection(q.Merge(q.Var('options'), { name: q.Var('name'), data: q.Var('annotated') })),
            action: action(q.Var('ctx'))('insert', q.Var('doc')).log(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        // ---
        const offline = 'factory.collection.insert';
        const online = { name: BiotaFunctionName('CollectionInsert'), role: null };
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
        const offline = 'factory.collection.update';
        const online = { name: BiotaFunctionName('CollectionUpdate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },

      upsert(options) {

        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Var('ref')),
              collection(q.Var('ctx'))(q.Var('ref')).update(q.Var('options')),
              collection(q.Var('ctx'))(q.Var('ref')).insert(q.Var('options')),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.collection.upsert';
        const online = { name: BiotaFunctionName('CollectionUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },

      replace(options) {

        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            current_doc: ResultData(collection(q.Var('ctx'))(q.Var('ref')).get()),
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
        const offline = 'factory.collection.replace';
        const online = { name: BiotaFunctionName('CollectionReplace'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },

      repsert(options) {

        const inputs = { ref, options };
        // ---
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Var('ref')),
              ResultData(collection(q.Var('ctx'))(q.Var('ref')).replace(q.Var('options'))),
              ResultData(collection(q.Var('ctx'))(q.Var('ref')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.collection.repsert';
        const online = { name: BiotaFunctionName('CollectionRepsert'), role: null };
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
        const offline = 'factory.collection.delete';
        const online = { name: BiotaFunctionName('CollectionDelete'), role: null };
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
        const online = { name: BiotaFunctionName('CollectionRestore'), role: null };
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
        const offline = 'factory.collection.forget';
        const online = { name: BiotaFunctionName('CollectionRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },

      drop() {
        const inputs = { ref };
        // ---
        const query = Query(
          {
            doc: q.If(q.Exists(q.Var('ref')), collection(q.Var('ctx'))(q.Var('ref')).forget(), false),
          },
          q.Var('doc'),
        );
        // ---
        const offline = 'factory.collection.drop';
        const online = { name: BiotaFunctionName('CollectionClean'), role: null };
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
        const offline = 'factory.document.expireAt';
        const online = { name: BiotaFunctionName('CollectionExpireAt'), role: null };
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
        const offline = 'factory.document.expireIn';
        const online = { name: BiotaFunctionName('CollectionExpireIn'), role: null };
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
        const offline = 'factory.document.expireNow';
        const online = { name: BiotaFunctionName('CollectionExpireNow'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
