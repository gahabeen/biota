import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const drop: FactoryKey<FrameworkKeyApi['drop']> = function (keyName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop (${keyName})`,
          task() {
            return self.query(key(self.context)(keyName).drop());
          },
        },
      ],
      {
        domain: 'Biota.key.drop',
      },
    );
  };
};
