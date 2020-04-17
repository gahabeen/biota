import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';
import { FactoryToken } from 'types/factory/factory.token';
import { FrameworkTokenApi } from 'types/framework/framework.token';

export const drop: FactoryToken<FrameworkTokenApi['drop']> = function (this: Biota, idOrRefOrInstance) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop [${idOrRefOrInstance}]`,
          task() {
            return self.query(token(self.context)(idOrRefOrInstance).drop());
          },
        },
      ],
      {
        domain: 'Biota.token.drop',
      },
    );
  };
};
