import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { Identity } from '~/factory/constructors/identity';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { ReferenceId } from '~/factory/api/constructors';

export const currentUserUpdate: FrameworkUserApi['update'] = function (this: Biota, data) {
  const self = this;

  return execute(
    [
      {
        name: `Update current user`,
        task() {
          return self.query(user(self.context)(ReferenceId(Identity())).update(data));
        },
      },
    ],
    {
      domain: 'Biota.current.user.update',
    },
  );
};
