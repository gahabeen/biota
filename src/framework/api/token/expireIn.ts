import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';
import { FrameworkTokenApi } from '~/types/framework/framework.token';
import { FactoryToken } from '~/types/factory/factory.token';

export const expireIn: FactoryToken<FrameworkTokenApi['expireIn']> = function (idOrInstance) {
  const self = this;

  return async (delay) => {
    return execute(
      [
        {
          name: `Expire [${idOrInstance}] delayd of ${delay}ms`,
          task() {
            return self.query(token(self.context)(idOrInstance).expireIn(delay));
          },
        },
      ],
      {
        domain: 'Biota.token.expireIn',
      },
    );
  };
};
