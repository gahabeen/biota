import { query as q } from 'faunadb';
import { Identity } from '~/factory/constructors/identity';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { ReferenceId } from '~/factory/api/constructors';

export const currentUserReplace: FrameworkUserApi['replace'] = function (options) {
  const self = this;

  return execute(
    [
      {
        name: `Replace current user`,
        task() {
          return self.query(user(self.context)(ReferenceId(Identity())).replace(options));
        },
      },
    ],
    {
      domain: 'Biota.current.user.replace',
    },
  );
};
