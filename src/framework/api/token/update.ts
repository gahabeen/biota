import { FactoryToken } from '~/types/factory/factory.token';
import { FrameworkTokenApi } from '~/types/framework/framework.token';
import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';

export const update: FactoryToken<FrameworkTokenApi['update']> = function (this: Biota, idOrRefOrInstance) {
  const self = this;

  return async (data: object) => {
    return execute(
      [
        {
          name: `Update [${idOrRefOrInstance}]`,
          task() {
            return self.query(token(self.context)(idOrRefOrInstance).update(data));
          },
        },
      ],
      {
        domain: 'Biota.token.update',
      },
    );
  };
};
