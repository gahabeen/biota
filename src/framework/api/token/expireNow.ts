import { FrameworkDatabasesApi } from 'types/framework/framework.databases';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';
import { FrameworkTokenApi } from 'types/framework/framework.token';
import { FactoryToken } from 'types/factory/factory.token';

export const expireNow: FactoryToken<FrameworkTokenApi['expireNow']> = function (idOrRefOrInstance) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${idOrRefOrInstance}] now`,
          task() {
            return self.query(token(self.context)(idOrRefOrInstance).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.token.expireNow',
      },
    );
  };
};
