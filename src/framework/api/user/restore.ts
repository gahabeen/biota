import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const restore: FactoryUser<FrameworkUserApi['restore']> = function (this: Biota, id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore [${id}]`,
          task() {
            return self.query(user(self.context)(id).restore());
          },
        },
      ],
      {
        domain: 'Biota.user.restore',
      },
    );
  };
};
