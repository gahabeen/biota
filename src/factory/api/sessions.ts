import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactorySessionsApi } from '~/types/factory/factory.sessions';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { MethodDispatch, Query } from '~/factory/constructors/method';
import { ResultData } from '~/factory/constructors/result';
import { BiotaFunctionName } from '~/factory/constructors/udfunction';
import { session } from './session';
import { Pagination } from '../constructors/pagination';

// tslint:disable-next-line: only-arrow-functions
export const sessions: FactoryContext<FactorySessionsApi> = function (context): FactorySessionsApi {
  return {
    findAll(pagination) {
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Paginate(q.Documents(q.Collection(BiotaCollectionName('user_sessions'))), Pagination(q.Var('pagination'))),
            q.Lambda('x', q.Get(q.Var('x'))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.paginate';
      const online = { name: BiotaFunctionName('SessionsFindAll'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(session(q.Var('ctx'))(q.Var('name')).get()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.getMany';
      const online = { name: BiotaFunctionName('SessionsGetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    insertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(session(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).insert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.insertMany';
      const online = { name: BiotaFunctionName('SessionsInsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    updateMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(session(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).update(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.updateMany';
      const online = { name: BiotaFunctionName('SessionsUpdateMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    upsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(session(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).upsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.upsertMany';
      const online = { name: BiotaFunctionName('SessionsUpsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    replaceMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(session(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).replace(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.replaceMany';
      const online = { name: BiotaFunctionName('SessionsReplaceMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    repsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(session(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).repsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.repsertMany';
      const online = { name: BiotaFunctionName('SessionsRepsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    deleteMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(session(q.Var('ctx'))(q.Var('name')).delete()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.deleteMany';
      const online = { name: BiotaFunctionName('SessionsDeleteMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    restoreMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(session(q.Var('ctx'))(q.Var('name')).restore()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.restoreMany';
      const online = { name: BiotaFunctionName('SessionsRestoreMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    forgetMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(session(q.Var('ctx'))(q.Var('name')).forget()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.forgetMany';
      const online = { name: BiotaFunctionName('SessionsForgetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    dropMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(session(q.Var('ctx'))(q.Var('name')).drop()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.dropMany';
      const online = { name: BiotaFunctionName('SessionsDropMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyAt(nameList, at) {
      const inputs = { nameList, at };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(session(q.Var('ctx'))(q.Var('name')).expireAt(q.Var('at'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.expireManyAt';
      const online = { name: BiotaFunctionName('SessionsExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyIn(nameList, delay) {
      const inputs = { nameList, delay };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(session(q.Var('ctx'))(q.Var('name')).expireIn(q.Var('delay'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.expireManyAt';
      const online = { name: BiotaFunctionName('SessionsExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyNow(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(session(q.Var('ctx'))(q.Var('name')).expireNow()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.sessions.expireManyNow';
      const online = { name: BiotaFunctionName('SessionsExpireManyNow'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
