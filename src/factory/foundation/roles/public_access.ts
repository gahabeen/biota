import { BiotaRoleName } from '~/factory/constructors/role';
import { FaunaRoleOptions } from '~/types/fauna';

// tslint:disable-next-line: variable-name
export const public_access: FaunaRoleOptions = {
  name: BiotaRoleName('public_access'),
  privileges: [
    // EXAMPLE for public access
    // Privilege({
    //   resource: q.Collection('todos'),
    //   rights: {
    //     get: ['public'],
    //   },
    // }),
  ],
};
