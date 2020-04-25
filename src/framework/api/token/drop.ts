import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';
import { FactoryToken } from '~/types/factory/factory.token';
import { FrameworkTokenApi } from '~/types/framework/framework.token';

export const drop: FactoryToken<FrameworkTokenApi['drop']> = function (this: Biota, idOrInstance) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop [${idOrInstance}]`,
          task() {
            return self.query(token(self.context)(idOrInstance).drop());
          },
        },
      ],
      {
        domain: 'Biota.token.drop',
      },
    );
  };
};
