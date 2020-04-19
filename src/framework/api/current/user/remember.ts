import { query as q } from 'faunadb';
import { Biota } from '~/biota';
import { Identity } from '~/factory/api/ql';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';

export const currentUserRemember: FrameworkUserApi['remember'] = function (this: Biota) {
  const self = this;
  return execute(
    [
      {
        name: `Remember current user`,
        task() {
          return self.query(user(self.context)(q.Select('id', Identity(), null)).remember());
        },
      },
    ],
    {
      domain: 'Biota.current.user.remember',
    },
  );
};
