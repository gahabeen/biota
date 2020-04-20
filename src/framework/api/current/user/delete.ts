import { query as q } from 'faunadb';
import { Identity } from '~/factory/constructors/identity';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { Biota } from '~/biota';

// tslint:disable-next-line: variable-name
export const curentUserDelete: FrameworkUserApi['delete'] = function (this: Biota) {
  const self = this;

  return execute(
    [
      {
        name: `Delete current user`,
        task() {
          return self.query(user(self.context)(q.Select('id', Identity(), null)).delete());
        },
      },
    ],
    {
      domain: 'Biota.current.user.delete',
    },
  );
};
