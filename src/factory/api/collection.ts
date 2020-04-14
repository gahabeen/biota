import { query as q } from 'faunadb';
import { FactoryCollection } from '~/../types/factory/factory.collection';
import { FactoryContext } from '~/../types/factory/factory.context';
import { action } from '~/factory/api/action';
import { MethodDispatch, Query } from '../constructors/method';
import { ResultData } from '../constructors/result';
import { BiotaFunctionName } from '../constructors/udfunction';
import { ContextExtend } from './constructors';
import { DefaultToOjbect } from './ql/defaultTo';

// tslint:disable-next-line: only-arrow-functions
export const collection: FactoryContext<FactoryCollection> = function (context): FactoryCollection {
  context = ContextExtend(context);
  // const offline = ContextProp(context, 'offline');

  // tslint:disable-next-line: only-arrow-functions
  return (name = null) => {
    const ref = q.Collection(name);
    return {
      get() {
        const inputs = { ref };
        const query = Query(
          {
            doc: q.Get(q.Var('ref')),
          },
          q.Var('doc'),
        );
        const offline = 'factory.collection.get';
        const online = { name: BiotaFunctionName('CollectionGet'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      insert(options) {
        options = DefaultToOjbect(options);
        const inputs = { name, options };
        const query = Query(
          {
            doc: q.CreateCollection(q.Merge(q.Var('options'), { name: q.Var('name') })),
            action: action(q.Var('ctx'))('insert', q.Var('doc')).insert(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        const offline = 'factory.collection.insert';
        const online = { name: BiotaFunctionName('CollectionInsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      update(options) {
        options = DefaultToOjbect(options);
        const inputs = { ref, options };
        const query = Query(
          {
            doc: q.Update(q.Var('ref'), q.Var('options')),
            action: action(q.Var('ctx'))('update', q.Var('doc')).insert(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        const offline = 'factory.collection.update';
        const online = { name: BiotaFunctionName('CollectionUpdate'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      upsert(options) {
        options = DefaultToOjbect(options);
        const inputs = { ref, options };
        const query = Query(
          {
            doc: q.If(
              q.Exists(q.Var('ref')),
              collection(q.Var('ctx'))(q.Var('ref')).update(q.Var('options')),
              collection(q.Var('ctx'))(q.Var('ref')).insert(q.Var('options')),
            ),
          },
          q.Var('doc'),
          // already logging actions: update or insert
        );
        const offline = 'factory.collection.upsert';
        const online = { name: BiotaFunctionName('CollectionUpsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      replace(options) {
        options = DefaultToOjbect(options);
        const inputs = { ref, options };
        const query = Query(
          {
            doc: q.Replace(q.Var('ref'), q.Var('options')),
            action: action(q.Var('ctx'))('replace', q.Var('doc')).insert(),
          },
          q.Var('doc'),
          q.Var('action'),
        );
        const offline = 'factory.collection.replace';
        const online = { name: BiotaFunctionName('CollectionReplace'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      repsert(options) {
        options = DefaultToOjbect(options);
        const inputs = { ref, options };
        const query = Query(
          {
            doc: q.If(
              q.Exists(ref),
              ResultData(collection(q.Var('ctx'))(q.Var('ref')).replace(q.Var('options'))),
              ResultData(collection(q.Var('ctx'))(q.Var('ref')).insert(q.Var('options'))),
            ),
          },
          q.Var('doc'),
          // already logging actions: replace or insert
        );
        const offline = 'factory.collection.repsert';
        const online = { name: BiotaFunctionName('CollectionRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      delete() {
        const inputs = {};
        const query = null;
        const offline = 'factory.collection.delete';
        const online = { name: BiotaFunctionName('CollectionDelete'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      forget() {
        const inputs = { ref };
        const query = Query(
          {
            action: action(q.Var('ctx'))('forget', q.Var('ref')).insert(),
            doc: q.Delete(q.Var('ref')),
          },
          q.Var('doc'),
        );
        const offline = 'factory.collection.forget';
        const online = { name: BiotaFunctionName('CollectionRepsert'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
      clean() {
        const inputs = { ref };
        const query = Query(
          {
            doc: q.If(q.Exists(q.Var('ref')), collection(q.Var('ctx'))(q.Var('ref')).forget(), false),
            // already logging actions: forget
          },
          q.Var('doc'),
        );
        const offline = 'factory.collection.clean';
        const online = { name: BiotaFunctionName('DocumentClean'), role: null };
        return MethodDispatch({ context, inputs, query })(offline, online);
      },
    };
  };
};
