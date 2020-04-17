import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FactoryUser } from 'types/factory/factory.user';
import { FrameworkUserApi } from 'types/framework/framework.user';

export const history: FactoryUser<FrameworkUserApi['history']> = function (this: Biota, idOrRef) {
  const self = this;

  return async (pagination) => {
    return execute(
      [
        {
          name: `History of [${idOrRef}]`,
          task() {
            return self.query(user(self.context)(idOrRef).history(pagination));
          },
        },
      ],
      {
        domain: 'Biota.user.history',
      },
    );
  };
};
