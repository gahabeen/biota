import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { query as q } from 'faunadb';
import { Identity } from '~/factory/api/ql';

export const currentUserForget: FactoryUser<FrameworkUserApi['forget']> = function (id = null) {
  const self = this;

  return async () => {
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
};
