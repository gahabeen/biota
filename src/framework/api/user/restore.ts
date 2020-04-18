import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const restore: FactoryUser<FrameworkUserApi['restore']> = function (this: Biota, idOrRef) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore [${idOrRef}]`,
          task() {
            return self.query(user(self.context)(idOrRef).restore());
          },
        },
      ],
      {
        domain: 'Biota.user.restore',
      },
    );
  };
};
