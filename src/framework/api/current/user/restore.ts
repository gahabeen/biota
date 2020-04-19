import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { query as q } from 'faunadb';
import { Identity } from '~/factory/api/ql';

export const currentUserRestore: FactoryUser<FrameworkUserApi['restore']> = function (this: Biota, id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore current user`,
          task() {
            return self.query(user(self.context)(q.Select('id', Identity(), null)).restore());
          },
        },
      ],
      {
        domain: 'Biota.current.user.restore',
      },
    );
  };
};
