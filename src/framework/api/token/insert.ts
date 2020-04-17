import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';
import { FactoryToken } from 'types/factory/factory.token';
import { FrameworkTokenApi } from 'types/framework/framework.token';

export const insert: FactoryToken<FrameworkTokenApi['insert']> = function (this: Biota, idOrRefOrInstance) {
  const self = this;

  return async (data: any) => {
    return execute(
      [
        {
          name: `Insert [${idOrRefOrInstance})`,
          task() {
            return self.query(token(self.context)(idOrRefOrInstance).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.token.insert',
      },
    );
  };
};
