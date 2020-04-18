import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const update: FactoryUser<FrameworkUserApi['update']> = function (idOrRef) {
  const self = this;

  return async function updateMethod(data) {
    return execute(
      [
        {
          name: `Update (${idOrRef})`,
          task() {
            return self.query(user(self.context)(idOrRef).update(data));
          },
        },
      ],
      {
        domain: 'Biota.user.update',
      },
    );
  };
};
