import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';
import { FrameworkTokenApi } from '~/types/framework/framework.token';
import { FactoryToken } from '~/types/factory/factory.token';

export const expireAt: FactoryToken<FrameworkTokenApi['expireAt']> = function (idOrRefOrInstance) {
  const self = this;

  return async (at) => {
    return execute(
      [
        {
          name: `Expire [${idOrRefOrInstance}] at ${at}`,
          task() {
            return self.query(token(self.context)(idOrRefOrInstance).expireAt(at));
          },
        },
      ],
      {
        domain: 'Biota.token.expireAt',
      },
    );
  };
};
