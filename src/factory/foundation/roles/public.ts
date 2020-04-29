import { BiotaRoleName } from '~/factory/constructors/role';
import { FaunaRoleOptions } from '~/types/fauna';

// tslint:disable-next-line: variable-name
export const public_: FaunaRoleOptions = {
  name: BiotaRoleName('public'),
  privileges: [
    /**
     * User-Defined Functions get automatically added when loaded
     */
  ],
};
