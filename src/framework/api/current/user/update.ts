import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { query as q } from 'faunadb';
import { Identity } from '~/factory/api/ql';

export const currentUserUpdate: FactoryUser<FrameworkUserApi['update']> = function (id) {
  const self = this;

  return async function updateMethod(data) {
    return execute(
      [
        {
          name: `Update current user`,
          task() {
            return self.query(user(self.context)(q.Select('id', Identity(), null)).update(data));
          },
        },
      ],
      {
        domain: 'Biota.current.user.update',
      },
    );
  };
};
