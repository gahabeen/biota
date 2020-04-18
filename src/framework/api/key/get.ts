import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const get: FactoryKey<FrameworkKeyApi['get']> = function (keyName) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${keyName})`,
          task() {
            return self.query(key(self.context)(keyName).get());
          },
        },
      ],
      {
        domain: 'Biota.key.get',
      },
    );
  };
};
