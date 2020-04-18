import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const replace: FactoryKey<FrameworkKeyApi['replace']> = function (keyName) {
  const self = this;

  return async function replaceMethod(options) {
    return execute(
      [
        {
          name: `Replace (${keyName})`,
          task() {
            return self.query(key(self.context)(keyName).replace(options));
          },
        },
      ],
      {
        domain: 'Biota.key.replace',
      },
    );
  };
};
