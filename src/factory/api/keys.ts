import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryKeysApi } from '~/types/factory/factory.keys';

import { MethodQuery, MethodDispatch } from '~/factory/constructors/method';
import { BiotaFunctionName, ResultData } from './constructors';
import { key } from './key';
import { Pagination } from '../constructors/pagination';
import { FaunaRef } from '~/types/fauna';

// tslint:disable-next-line: only-arrow-functions
export const keys: FactoryContext<FactoryKeysApi> = function (context): FactoryKeysApi {
  return {
    findAll(pagination) {
      const inputs = { pagination };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Paginate(q.Keys(), Pagination(q.Var('pagination'))), q.Lambda('x', q.Get(q.Var('x')))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.keys.paginate';
      const online = { name: BiotaFunctionName('KeysFindAll'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
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
      const query = MethodQuery(
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
      const query = MethodQuery(
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
      const query = MethodQuery(
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
      const query = MethodQuery(
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
      const query = MethodQuery(
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
    forgetMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
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
    revokeMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: keys(q.Var('ctx')).forgetMany(q.Var('nameList') as FaunaRef[]),
        },
        ResultData(q.Var('docs')),
      );
      // ---
      const offline = 'factory.keys.revokeMany';
      const online = { name: BiotaFunctionName('KeysRevokeMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    dropMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
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
  };
};
