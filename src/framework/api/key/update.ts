import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const update: FactoryKey<FrameworkKeyApi['update']> = function (keyName) {
  const self = this;

  return async function updateMethod(data) {
    return execute(
      [
        {
          name: `Update (${keyName})`,
          task() {
            return self.query(key(self.context)(keyName).update(data));
          },
        },
      ],
      {
        domain: 'Biota.key.update',
      },
    );
  };
};
