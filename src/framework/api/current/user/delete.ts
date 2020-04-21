import { query as q } from 'faunadb';
import { Identity } from '~/factory/constructors/identity';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { Biota } from '~/biota';
import { ReferenceId } from '~/factory/api/constructors';

// tslint:disable-next-line: variable-name
export const curentUserDelete: FrameworkUserApi['delete'] = function (this: Biota) {
  const self = this;

  return execute(
    [
      {
        name: `Delete current user`,
        task() {
          return self.query(user(self.context)(ReferenceId(Identity())).delete());
        },
      },
    ],
    {
      domain: 'Biota.current.user.delete',
    },
  );
};
