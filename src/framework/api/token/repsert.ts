import { FactoryToken } from 'types/factory/factory.token';
import { FrameworkTokenApi } from 'types/framework/framework.token';
import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';

export const repsert: FactoryToken<FrameworkTokenApi['repsert']> = function (this: Biota, idOrRefOrInstance) {
  const self = this;

  return async (data: object) => {
    return execute(
      [
        {
          name: `Replace/Insert [${idOrRefOrInstance}]`,
          task() {
            return self.query(token(self.context)(idOrRefOrInstance).repsert(data));
          },
        },
      ],
      {
        domain: 'Biota.token.repsert',
      },
    );
  };
};
