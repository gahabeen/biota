import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { Identity } from '~/factory/api/ql';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkCurrentUserApi } from '~/types/framework/framework.current.user';

export const currentUserMe: FrameworkCurrentUserApi['me'] = function (this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Get current user`,
        task() {
          return self.query(q.Identity());
          // return self.query(user(self.context)(q.Select('id', Identity(), null)).get());
        },
      },
    ],
    {
      domain: 'Biota.current.user.me',
    },
  );
};
