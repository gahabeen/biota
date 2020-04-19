import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const changePassword: FactoryUser<FrameworkUserApi['changePassword']> = function () {
  const self = this;

  return async (currentPassword, password) => {
    return execute(
      [
        {
          name: `Change password`,
          task() {
            return self.query(user(self.context)().changePassword(currentPassword, password));
          },
        },
      ],
      {
        domain: 'Biota.user.changePassword',
      },
    );
  };
};
