import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const upsert: FactoryKey<FrameworkKeyApi['upsert']> = function (keyName) {
  const self = this;

  return async function upsertMethod(data) {
    return execute(
      [
        {
          name: `Update/Insert (${keyName})`,
          task() {
            return self.query(key(self.context)(keyName).upsert(data));
          },
        },
      ],
      {
        domain: 'Biota.key.upsert',
      },
    );
  };
};
