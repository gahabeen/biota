import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryTokensApi } from '~/types/factory/factory.tokens';
import { BiotaIndexName } from '~/factory/constructors';
import { MethodDispatch, Query } from '~/factory/constructors/method';
import { ResultData } from '~/factory/constructors/result';
import { BiotaFunctionName } from './constructors';
import { token } from './token';
import { Pagination } from '../constructors/pagination';

// tslint:disable-next-line: only-arrow-functions
export const tokens: FactoryContext<FactoryTokensApi> = function (context): FactoryTokensApi {
  return {
    findByInstance(instance, pagination) {
      const inputs = { instance, pagination };
      // ---
      const query = Query(
        {
          docs: q.Paginate(q.Match(q.Index(BiotaIndexName('tokens__by__instance')), q.Var('instance')), Pagination(q.Var('pagination'))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.paginate';
      const online = { name: BiotaFunctionName('TokensFindAll'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    findAll(pagination) {
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Paginate(q.Documents(q.Tokens()), Pagination(q.Var('pagination'))), q.Lambda('x', q.Get(q.Var('x')))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.paginate';
      const online = { name: BiotaFunctionName('TokensFindAll'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(token(q.Var('ctx'))(q.Var('name')).get()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.getMany';
      const online = { name: BiotaFunctionName('TokensGetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    insertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(token(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).insert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.insertMany';
      const online = { name: BiotaFunctionName('TokensInsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    updateMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(token(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).update(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.updateMany';
      const online = { name: BiotaFunctionName('TokensUpdateMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    upsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(token(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).upsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.upsertMany';
      const online = { name: BiotaFunctionName('TokensUpsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    replaceMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(token(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).replace(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.replaceMany';
      const online = { name: BiotaFunctionName('TokensReplaceMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    repsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(token(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).repsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.repsertMany';
      const online = { name: BiotaFunctionName('TokensRepsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    deleteMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(token(q.Var('ctx'))(q.Var('name')).delete()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.deleteMany';
      const online = { name: BiotaFunctionName('TokensDeleteMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    restoreMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(token(q.Var('ctx'))(q.Var('name')).restore()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.restoreMany';
      const online = { name: BiotaFunctionName('TokensRestoreMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    forgetMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(token(q.Var('ctx'))(q.Var('name')).forget()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.forgetMany';
      const online = { name: BiotaFunctionName('TokensForgetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    dropMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(token(q.Var('ctx'))(q.Var('name')).drop()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.dropMany';
      const online = { name: BiotaFunctionName('TokensDropMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyAt(nameList, at) {
      const inputs = { nameList, at };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(token(q.Var('ctx'))(q.Var('name')).expireAt(q.Var('at'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.expireManyAt';
      const online = { name: BiotaFunctionName('TokensExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyIn(nameList, delay) {
      const inputs = { nameList, delay };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(token(q.Var('ctx'))(q.Var('name')).expireIn(q.Var('delay'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.expireManyAt';
      const online = { name: BiotaFunctionName('TokensExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyNow(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(token(q.Var('ctx'))(q.Var('name')).expireNow()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.tokens.expireManyNow';
      const online = { name: BiotaFunctionName('TokensExpireManyNow'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
