import { FactoryToken } from '~/types/factory/factory.token';
import { FrameworkTokenApi } from '~/types/framework/framework.token';
import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';

export const restore: FactoryToken<FrameworkTokenApi['restore']> = function (this: Biota, idOrRefOrInstance) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore [${idOrRefOrInstance}]`,
          task() {
            return self.query(token(self.context)(idOrRefOrInstance).restore());
          },
        },
      ],
      {
        domain: 'Biota.token.restore',
      },
    );
  };
};
