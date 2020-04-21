import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { Identity } from '~/factory/constructors/identity';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkCurrentUserApi } from '~/types/framework/framework.current.user';
import { ReferenceId } from '~/factory/api/constructors';

export const currentUserMe: FrameworkCurrentUserApi['me'] = function (this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Get current user`,
        task() {
          return self.query(user(self.context)(ReferenceId(Identity())).get());
        },
      },
    ],
    {
      domain: 'Biota.current.user.me',
    },
  );
};
