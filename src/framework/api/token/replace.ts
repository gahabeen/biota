import { FactoryToken } from 'types/factory/factory.token';
import { FrameworkTokenApi } from 'types/framework/framework.token';
import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';

export const replace: FactoryToken<FrameworkTokenApi['replace']> = function (this: Biota, idOrRefOrInstance) {
  const self = this;

  return async (data: object) => {
    return execute(
      [
        {
          name: `Replace [${idOrRefOrInstance}]`,
          task() {
            return self.query(token(self.context)(idOrRefOrInstance).replace(data));
          },
        },
      ],
      {
        domain: 'Biota.token.replace',
      },
    );
  };
};
