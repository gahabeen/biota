import { FactoryToken } from '~/types/factory/factory.token';
import { FrameworkTokenApi } from '~/types/framework/framework.token';
import { Biota } from '~/biota';
import { token } from '~/factory/api/token';
import { execute } from '~/tools/tasks';

// tslint:disable-next-line: variable-name
export const delete_: FactoryToken<FrameworkTokenApi['delete']> = function (this: Biota, idOrInstance) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete [${idOrInstance}]`,
          task() {
            return self.query(token(self.context)(idOrInstance).delete());
          },
        },
      ],
      {
        domain: 'Biota.token.delete',
      },
    );
  };
};
