import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { Biota } from '~/biota';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const restore: FactoryKey<FrameworkKeyApi['restore']> = function (this: Biota, keyName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore [${keyName}]`,
          task() {
            return self.query(key(self.context)(keyName).restore());
          },
        },
      ],
      {
        domain: 'Biota.key.restore',
      },
    );
  };
};
