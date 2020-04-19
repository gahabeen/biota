import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { query as q } from 'faunadb';
import { Identity } from '~/factory/api/ql';

export const currentUserRemember: FactoryUser<FrameworkUserApi['remember']> = function (this: Biota, id) {
  const self = this;
  return async () => {
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
};
