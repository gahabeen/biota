import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { Identity } from '~/factory/constructors/identity';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { ReferenceId } from '~/factory/api/constructors';

export const currentUserRemember: FrameworkUserApi['remember'] = function (this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Remember current user`,
        task() {
          return self.query(user(self.context)(ReferenceId(Identity())).remember());
        },
      },
    ],
    {
      domain: 'Biota.current.user.remember',
    },
  );
};
