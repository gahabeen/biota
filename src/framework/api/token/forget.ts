import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';
import { FactoryToken } from 'types/factory/factory.token';
import { FrameworkTokenApi } from 'types/framework/framework.token';

export const forget: FactoryToken<FrameworkTokenApi['forget']> = function (this: Biota, idOrRefOrInstance) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget [${idOrRefOrInstance}]`,
          task() {
            return self.query(token(self.context)(idOrRefOrInstance).forget());
          },
        },
      ],
      {
        domain: 'Biota.token.forget',
      },
    );
  };
};
