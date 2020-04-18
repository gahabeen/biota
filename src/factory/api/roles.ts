import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryRolesApi } from '~/types/factory/factory.roles';

import { Query, MethodDispatch } from '~/factory/constructors/method';
import { BiotaFunctionName } from './constructors';
import { ResultData } from '~/factory/constructors/result';
import { role } from './role';

// tslint:disable-next-line: only-arrow-functions
export const roles: FactoryContext<FactoryRolesApi> = function (context): FactoryRolesApi {
  return {
    findAll(pagination) {
      const inputs = { pagination };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Paginate(q.Roles()), q.Lambda('x', q.Get(q.Var('x')))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.paginate';
      const online = { name: BiotaFunctionName('RolesPaginate'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(role(q.Var('ctx'))(q.Var('name')).get()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.getMany';
      const online = { name: BiotaFunctionName('RolesGetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    insertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(role(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).insert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.insertMany';
      const online = { name: BiotaFunctionName('RolesInsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    updateMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(role(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).update(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.updateMany';
      const online = { name: BiotaFunctionName('RolesUpdateMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    upsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(role(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).upsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.upsertMany';
      const online = { name: BiotaFunctionName('RolesUpsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    replaceMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(role(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).replace(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.replaceMany';
      const online = { name: BiotaFunctionName('RolesReplaceMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    repsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = Query(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(role(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).repsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.repsertMany';
      const online = { name: BiotaFunctionName('RolesRepsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    deleteMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(role(q.Var('ctx'))(q.Var('name')).delete()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.deleteMany';
      const online = { name: BiotaFunctionName('RolesDeleteMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    restoreMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(role(q.Var('ctx'))(q.Var('name')).restore()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.restoreMany';
      const online = { name: BiotaFunctionName('RolesRestoreMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    forgetMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(role(q.Var('ctx'))(q.Var('name')).forget()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.forgetMany';
      const online = { name: BiotaFunctionName('RolesForgetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    dropMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(role(q.Var('ctx'))(q.Var('name')).drop()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.dropMany';
      const online = { name: BiotaFunctionName('RolesDropMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyAt(nameList, at) {
      const inputs = { nameList, at };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(role(q.Var('ctx'))(q.Var('name')).expireAt(q.Var('at'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.expireManyAt';
      const online = { name: BiotaFunctionName('RolesExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyIn(nameList, delay) {
      const inputs = { nameList, delay };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(role(q.Var('ctx'))(q.Var('name')).expireIn(q.Var('delay'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.expireManyAt';
      const online = { name: BiotaFunctionName('RolesExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyNow(nameList) {
      const inputs = { nameList };
      // ---
      const query = Query(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(role(q.Var('ctx'))(q.Var('name')).expireNow()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.roles.expireManyNow';
      const online = { name: BiotaFunctionName('RolesExpireManyNow'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
