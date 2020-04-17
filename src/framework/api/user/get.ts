import { FactoryUser } from 'types/factory/factory.user';
import { FrameworkUserApi } from 'types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const get: FactoryUser<FrameworkUserApi['get']> = function (idOrRef) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${idOrRef})`,
          task() {
            return self.query(user(self.context)(idOrRef).get());
          },
        },
      ],
      {
        domain: 'Biota.user.get',
      },
    );
  };
};
