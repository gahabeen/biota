import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const expireNow: FactoryUser<FrameworkUserApi['expireNow']> = function (id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${id}] now`,
          task() {
            return self.query(user(self.context)(id).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.user.expireNow',
      },
    );
  };
};
