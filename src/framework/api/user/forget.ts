import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const forget: FactoryUser<FrameworkUserApi['forget']> = function (idOrRef) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget (${idOrRef})`,
          task() {
            return self.query(user(self.context)(idOrRef).forget());
          },
        },
      ],
      {
        domain: 'Biota.user.forget',
      },
    );
  };
};
