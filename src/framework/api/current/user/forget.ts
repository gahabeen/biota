import { query as q } from 'faunadb';
import { Identity } from '~/factory/api/ql';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';

export const currentUserForget: FrameworkUserApi['forget'] = function () {
  const self = this;

  return execute(
    [
      {
        name: `Forget current user`,
        task() {
          return self.query(user(self.context)(q.Select('id', Identity(), null)).forget());
        },
      },
    ],
    {
      domain: 'Biota.current.user.forget',
    },
  );
};
