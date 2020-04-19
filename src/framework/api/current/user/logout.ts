import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const currentUserLogout: FactoryUser<FrameworkUserApi['logout']> = function (id = null) {
  const self = this;

  return async (everywhere) => {
    return execute(
      [
        {
          name: `Logout ${everywhere ? ` from everywhere` : ''}`,
          task() {
            return self.query(user(self.context)().logout(everywhere));
          },
        },
      ],
      {
        domain: 'Biota.current.user.logout',
      },
    );
  };
};
