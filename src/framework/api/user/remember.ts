import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const remember: FactoryUser<FrameworkUserApi['remember']> = function (this: Biota, id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Remember [${id}]`,
          task() {
            return self.query(user(self.context)(id).remember());
          },
        },
      ],
      {
        domain: 'Biota.user.remember',
      },
    );
  };
};
