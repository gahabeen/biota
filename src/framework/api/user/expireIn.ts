import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const expireIn: FactoryUser<FrameworkUserApi['expireIn']> = function (idOrRef) {
  const self = this;

  return async (delay) => {
    return execute(
      [
        {
          name: `Expire [${idOrRef}] delayd of ${delay}ms`,
          task() {
            return self.query(user(self.context)(idOrRef).expireIn(delay));
          },
        },
      ],
      {
        domain: 'Biota.user.expireIn',
      },
    );
  };
};
