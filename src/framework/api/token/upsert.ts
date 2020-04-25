import { FactoryToken } from '~/types/factory/factory.token';
import { FrameworkTokenApi } from '~/types/framework/framework.token';
import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';

export const upsert: FactoryToken<FrameworkTokenApi['upsert']> = function (this: Biota, idOrInstance) {
  const self = this;

  return async (data: object) => {
    return execute(
      [
        {
          name: `Update/Insert [${idOrInstance}]`,
          task() {
            return self.query(token(self.context)(idOrInstance).upsert(data));
          },
        },
      ],
      {
        domain: 'Biota.token.upsert',
      },
    );
  };
};
