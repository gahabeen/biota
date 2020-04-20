import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryUDFunctionsApi } from '~/types/factory/factory.udfunctions';

import { MethodQuery, MethodDispatch } from '~/factory/constructors/method';
import { BiotaFunctionName } from './constructors';
import { ResultData } from '~/factory/constructors/result';
import { udfunction } from './udfunction';
import { Pagination } from '../constructors/pagination';

// tslint:disable-next-line: only-arrow-functions
export const udfunctions: FactoryContext<FactoryUDFunctionsApi> = function (context): FactoryUDFunctionsApi {
  return {
    findAll(pagination) {
      const inputs = { pagination };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Paginate(q.Functions(), Pagination(q.Var('pagination'))), q.Lambda('x', q.Get(q.Var('x')))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.paginate';
      const online = { name: BiotaFunctionName('UDFFindAll'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(udfunction(q.Var('ctx'))(q.Var('name')).get()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.getMany';
      const online = { name: BiotaFunctionName('UDFGetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    insertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(udfunction(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).insert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.insertMany';
      const online = { name: BiotaFunctionName('UDFInsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    updateMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(udfunction(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).update(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.updateMany';
      const online = { name: BiotaFunctionName('UDFUpdateMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    upsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(udfunction(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).upsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.upsertMany';
      const online = { name: BiotaFunctionName('UDFUpsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    replaceMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(udfunction(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).replace(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.replaceMany';
      const online = { name: BiotaFunctionName('UDFReplaceMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    repsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(udfunction(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).repsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.repsertMany';
      const online = { name: BiotaFunctionName('UDFRepsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    deleteMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(udfunction(q.Var('ctx'))(q.Var('name')).delete()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.deleteMany';
      const online = { name: BiotaFunctionName('UDFDeleteMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    restoreMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(udfunction(q.Var('ctx'))(q.Var('name')).restore()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.restoreMany';
      const online = { name: BiotaFunctionName('UDFRestoreMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    forgetMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(udfunction(q.Var('ctx'))(q.Var('name')).forget()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.forgetMany';
      const online = { name: BiotaFunctionName('UDFForgetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    dropMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(udfunction(q.Var('ctx'))(q.Var('name')).drop()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.dropMany';
      const online = { name: BiotaFunctionName('UDFDropMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyAt(nameList, at) {
      const inputs = { nameList, at };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(udfunction(q.Var('ctx'))(q.Var('name')).expireAt(q.Var('at'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.expireManyAt';
      const online = { name: BiotaFunctionName('UDFExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyIn(nameList, delay) {
      const inputs = { nameList, delay };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(udfunction(q.Var('ctx'))(q.Var('name')).expireIn(q.Var('delay'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.expireManyAt';
      const online = { name: BiotaFunctionName('UDFExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyNow(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(udfunction(q.Var('ctx'))(q.Var('name')).expireNow()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.udfunctions.expireManyNow';
      const online = { name: BiotaFunctionName('UDFExpireManyNow'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
