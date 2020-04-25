import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const expireAt: FactoryUser<FrameworkUserApi['expireAt']> = function (id) {
  const self = this;

  return async (at) => {
    return execute(
      [
        {
          name: `Expire [${id}] at ${at}`,
          task() {
            return self.query(user(self.context)(id).expireAt(at));
          },
        },
      ],
      {
        domain: 'Biota.user.expireAt',
      },
    );
  };
};
