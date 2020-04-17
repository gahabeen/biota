import { FactoryToken } from 'types/factory/factory.token';
import { FrameworkTokenApi } from 'types/framework/framework.token';
import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';

export const get: FactoryToken<FrameworkTokenApi['get']> = function (this: Biota, idOrRefOrInstance) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Get (${idOrRefOrInstance})`,
          task() {
            return self.query(token(self.context)(idOrRefOrInstance).get());
          },
        },
      ],
      {
        domain: 'Biota.token.get',
      },
    );
  };
};
