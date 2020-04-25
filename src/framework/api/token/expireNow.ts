import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';
import { FrameworkTokenApi } from '~/types/framework/framework.token';
import { FactoryToken } from '~/types/factory/factory.token';

export const expireNow: FactoryToken<FrameworkTokenApi['expireNow']> = function (idOrInstance) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${idOrInstance}] now`,
          task() {
            return self.query(token(self.context)(idOrInstance).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.token.expireNow',
      },
    );
  };
};
