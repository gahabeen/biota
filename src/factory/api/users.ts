import { query as q } from 'faunadb';
import { FactoryContext } from '~/types/factory/factory.context';
import { FactoryUsersApi } from '~/types/factory/factory.users';
import { BiotaIndexName } from '~/factory/constructors';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { ThrowError } from '~/factory/constructors/error';
import { MethodDispatch, MethodQuery } from '~/factory/constructors/method';
import { ResultData } from '~/factory/constructors/result';
import { BiotaFunctionName } from '~/factory/constructors/udfunction';
import { user } from './user';
import { Pagination } from '../constructors/pagination';
import { BiotaRoleName } from '../constructors/role';

// tslint:disable-next-line: only-arrow-functions
export const users: FactoryContext<FactoryUsersApi> = function (context): FactoryUsersApi {
  return {
    getByAuthAccount(providerOrAccount, id) {
      const account = q.If(q.IsObject(providerOrAccount), providerOrAccount, { provider: providerOrAccount, id });
      const provider = q.Select('provider', account, null);
      const accountId = q.Select('id', account, null);

      const inputs = { account, provider, accountId };
      // ---
      const query = MethodQuery(
        {
          user: q.Select(
            0,
            q.Paginate(q.Match(q.Index(BiotaIndexName('users__by__auth_account')), [q.Var('provider'), q.Var('accountId')])),
            null,
          ),
          userIsValid: q.If(
            q.IsDoc(q.Var('user')),
            true,
            ThrowError(q.Var('ctx'), "Could'nt find the user", { account: q.Var('account') }),
          ),
        },
        q.Var('user'),
      );
      // ---
      const offline = 'factory.users.getByAuthAccount';
      const online = { name: BiotaFunctionName('UsersGetByAuthAccount'), role: q.Role(BiotaRoleName('auth')) };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getByAuthEmail(email) {
      const inputs = { email };
      // ---
      const query = MethodQuery(
        {
          user: q.Select(0, q.Paginate(q.Match(q.Index(BiotaIndexName('users__by__auth_email')), q.Var('email'))), null),
          userIsValid: q.If(q.IsDoc(q.Var('user')), true, ThrowError(q.Var('ctx'), "Could'nt find the user", { email: q.Var('email') })),
        },
        q.Var('user'),
      );
      // ---
      const offline = 'factory.users.getByAuthEmail';
      const online = { name: BiotaFunctionName('UsersGetByAuthEmail'), role: q.Role(BiotaRoleName('auth')) };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    findAll(pagination) {
      const inputs = { pagination };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Paginate(q.Documents(q.Collection(BiotaCollectionName('users'))), Pagination(q.Var('pagination'))),
            q.Lambda('x', q.Get(q.Var('x'))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.paginate';
      const online = { name: BiotaFunctionName('UsersFindAll'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    getMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(user(q.Var('ctx'))(q.Var('name')).get()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.getMany';
      const online = { name: BiotaFunctionName('UsersGetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    insertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(user(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).insert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.insertMany';
      const online = { name: BiotaFunctionName('UsersInsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    updateMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(user(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).update(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.updateMany';
      const online = { name: BiotaFunctionName('UsersUpdateMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    upsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(user(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).upsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.upsertMany';
      const online = { name: BiotaFunctionName('UsersUpsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    replaceMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(user(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).replace(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.replaceMany';
      const online = { name: BiotaFunctionName('UsersReplaceMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    repsertMany(optionsList) {
      const inputs = { optionsList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(
            q.Var('optionsList'),
            q.Lambda(['options'], ResultData(user(q.Var('ctx'))(q.Select('name', q.Var('options'), null)).repsert(q.Var('options')))),
          ),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.repsertMany';
      const online = { name: BiotaFunctionName('UsersRepsertMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    deleteMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(user(q.Var('ctx'))(q.Var('name')).delete()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.deleteMany';
      const online = { name: BiotaFunctionName('UsersDeleteMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    restoreMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(user(q.Var('ctx'))(q.Var('name')).restore()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.restoreMany';
      const online = { name: BiotaFunctionName('UsersRestoreMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    forgetMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(user(q.Var('ctx'))(q.Var('name')).forget()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.forgetMany';
      const online = { name: BiotaFunctionName('UsersForgetMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    dropMany(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(user(q.Var('ctx'))(q.Var('name')).drop()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.dropMany';
      const online = { name: BiotaFunctionName('UsersDropMany'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyAt(nameList, at) {
      const inputs = { nameList, at };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(user(q.Var('ctx'))(q.Var('name')).expireAt(q.Var('at'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.expireManyAt';
      const online = { name: BiotaFunctionName('UsersExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyIn(nameList, delay) {
      const inputs = { nameList, delay };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(user(q.Var('ctx'))(q.Var('name')).expireIn(q.Var('delay'))))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.expireManyAt';
      const online = { name: BiotaFunctionName('UsersExpireManyAt'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
    expireManyNow(nameList) {
      const inputs = { nameList };
      // ---
      const query = MethodQuery(
        {
          docs: q.Map(q.Var('nameList'), q.Lambda(['name'], ResultData(user(q.Var('ctx'))(q.Var('name')).expireNow()))),
        },
        q.Var('docs'),
      );
      // ---
      const offline = 'factory.users.expireManyNow';
      const online = { name: BiotaFunctionName('UsersExpireManyNow'), role: null };
      return MethodDispatch({ context, inputs, query })(offline, online);
    },
  };
};
