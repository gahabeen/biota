import { query as q } from 'faunadb';
import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkCurrentUserApi } from '~/types/framework/framework.current.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { Identity } from '~/factory/api/ql';

export const currentUserMe: FactoryUser<FrameworkCurrentUserApi['me']> = function () {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Get current user`,
          task() {
            return self.query(user(self.context)(q.Select('id', Identity(), null)).get());
          },
        },
      ],
      {
        domain: 'Biota.current.user.me',
      },
    );
  };
};
