import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { query as q } from 'faunadb';
import { Identity } from '~/factory/api/ql';

export const currentUserReplace: FactoryUser<FrameworkUserApi['replace']> = function (id) {
  const self = this;

  return async function replaceMethod(options) {
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
};
