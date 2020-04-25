import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';
import { FrameworkTokenApi } from '~/types/framework/framework.token';
import { FactoryToken } from '~/types/factory/factory.token';

export const expireAt: FactoryToken<FrameworkTokenApi['expireAt']> = function (idOrInstance) {
  const self = this;

  return async (at) => {
    return execute(
      [
        {
          name: `Expire [${idOrInstance}] at ${at}`,
          task() {
            return self.query(token(self.context)(idOrInstance).expireAt(at));
          },
        },
      ],
      {
        domain: 'Biota.token.expireAt',
      },
    );
  };
};
