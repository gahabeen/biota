import { FactoryToken } from 'types/factory/factory.token';
import { FrameworkTokenApi } from 'types/framework/framework.token';
import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';

export const upsert: FactoryToken<FrameworkTokenApi['upsert']> = function (this: Biota, idOrRefOrInstance) {
  const self = this;

  return async (data: object) => {
    return execute(
      [
        {
          name: `Update/Insert [${idOrRefOrInstance}]`,
          task() {
            return self.query(token(self.context)(idOrRefOrInstance).upsert(data));
          },
        },
      ],
      {
        domain: 'Biota.token.upsert',
      },
    );
  };
};
