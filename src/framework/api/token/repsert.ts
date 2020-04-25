import { FactoryToken } from '~/types/factory/factory.token';
import { FrameworkTokenApi } from '~/types/framework/framework.token';
import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';

export const repsert: FactoryToken<FrameworkTokenApi['repsert']> = function (this: Biota, idOrInstance) {
  const self = this;

  return async (data: object) => {
    return execute(
      [
        {
          name: `Replace/Insert [${idOrInstance}]`,
          task() {
            return self.query(token(self.context)(idOrInstance).repsert(data));
          },
        },
      ],
      {
        domain: 'Biota.token.repsert',
      },
    );
  };
};
