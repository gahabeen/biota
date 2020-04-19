import { query as q } from 'faunadb';
import { Identity } from '~/factory/api/ql';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';

export const currentUserReplace: FrameworkUserApi['replace'] = function (options) {
  const self = this;

  return execute(
    [
      {
        name: `Replace current user`,
        task() {
          return self.query(user(self.context)(q.Select('id', Identity(), null)).replace(options));
        },
      },
    ],
    {
      domain: 'Biota.current.user.replace',
    },
  );
};
