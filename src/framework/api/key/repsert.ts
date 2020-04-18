import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const repsert: FactoryKey<FrameworkKeyApi['repsert']> = function (keyName) {
  const self = this;

  return async function repsertMethod(options) {
    return execute(
      [
        {
          name: `Replace/Insert (${keyName})`,
          task() {
            return self.query(key(self.context)(keyName).repsert(options));
          },
        },
      ],
      {
        domain: 'Biota.key.repsert',
      },
    );
  };
};
