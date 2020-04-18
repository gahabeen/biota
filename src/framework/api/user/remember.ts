import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const remember: FactoryUser<FrameworkUserApi['remember']> = function (this: Biota, idOrRef) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Remember [${idOrRef}]`,
          task() {
            return self.query(user(self.context)(idOrRef).remember());
          },
        },
      ],
      {
        domain: 'Biota.user.remember',
      },
    );
  };
};
