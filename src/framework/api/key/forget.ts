import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const forget: FactoryKey<FrameworkKeyApi['forget']> = function (keyName) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget (${keyName})`,
          task() {
            return self.query(key(self.context)(keyName).forget());
          },
        },
      ],
      {
        domain: 'Biota.key.forget',
      },
    );
  };
};
