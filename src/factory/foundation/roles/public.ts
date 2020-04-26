import { query as q } from 'faunadb';
import { BiotaFunctionName } from '~/factory/api/constructors';
import { Privilege } from '~/factory/constructors/privilege';
import { BiotaRoleName } from '~/factory/constructors/role';
import { FaunaRoleOptions } from '~/types/fauna';

// tslint:disable-next-line: variable-name
export const public_: FaunaRoleOptions = {
  name: BiotaRoleName('public'),
  privileges: [
    // EXAMPLE for public access
    // Privilege({
    //   resource: q.Collection('todos'),
    //   rights: {
    //     get: ['public'],
    //   },
    // }),
    Privilege({
      resource: q.Collection('todos'),
      rights: {
        get: ['public'],
      },
    }),
    Privilege({
      resource: q.Function(BiotaFunctionName('UDFunctionExists')),
      actions: { call: true },
    }),
    Privilege({
      resource: q.Function(BiotaFunctionName('UserLogin')),
      actions: { call: true },
    }),
    Privilege({
      resource: q.Function(BiotaFunctionName('UserRegister')),
      actions: { call: true },
    }),
    Privilege({
      resource: q.Function(BiotaFunctionName('SessionPassport')),
      actions: { call: true },
    }),
  ],
};
