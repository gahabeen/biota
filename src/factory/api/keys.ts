import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryKeysApi } from '~/types/factory/factory.keys';

import { Query, MethodDispatch } from '~/factory/constructors/method';
import { BiotaFunctionName, ResultData } from './constructors';
import { key } from './key';

// tslint:disable-next-line: only-arrow-functions
export const keys: FactoryContext<FactoryKeysApi> = function (context): FactoryKeysApi {
  return {
    findAll(pagination) {
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Paginate(q.Keys(), q.Var('pagination')), q.Lambda('x', q.Get(q.Var('x')))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.paginate';
      const online = { name: BiotaFunctionName('KeysPaginate'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(key(q.Var('ctx'))(q.Var('name')).get()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.getMany';
      const online = { name: BiotaFunctionName('KeysGetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    insertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(key(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).insert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.insertMany';
      const online = { name: BiotaFunctionName('KeysInsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    updateMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(key(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).update(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.updateMany';
      const online = { name: BiotaFunctionName('KeysUpdateMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    upsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(key(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).upsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.upsertMany';
      const online = { name: BiotaFunctionName('KeysUpsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    replaceMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(key(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).replace(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.replaceMany';
      const online = { name: BiotaFunctionName('KeysReplaceMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    repsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(key(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).repsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.repsertMany';
      const online = { name: BiotaFunctionName('KeysRepsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    deleteMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(key(q.Var('ctx'))(q.Var('name')).delete()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.deleteMany';
      const online = { name: BiotaFunctionName('KeysDeleteMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    restoreMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(key(q.Var('ctx'))(q.Var('name')).restore()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.restoreMany';
      const online = { name: BiotaFunctionName('KeysRestoreMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    forgetMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(key(q.Var('ctx'))(q.Var('name')).forget()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.forgetMany';
      const online = { name: BiotaFunctionName('KeysForgetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    dropMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(key(q.Var('ctx'))(q.Var('name')).drop()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.dropMany';
      const online = { name: BiotaFunctionName('KeysDropMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyAt(nameList, at) {
      const inputs = { nameList, at };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(key(q.Var('ctx'))(q.Var('name')).expireAt(q.Var('at'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.expireManyAt';
      const online = { name: BiotaFunctionName('KeysExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyIn(nameList, delay) {
      const inputs = { nameList, delay };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(key(q.Var('ctx'))(q.Var('name')).expireIn(q.Var('delay'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.expireManyAt';
      const online = { name: BiotaFunctionName('KeysExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyNow(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(key(q.Var('ctx'))(q.Var('name')).expireNow()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.expireManyNow';
      const online = { name: BiotaFunctionName('KeysExpireManyNow'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
