import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const expireAt: FactoryKey<FrameworkKeyApi['expireAt']> = function (keyName) {
  const self = this;

  return async (at) => {
    return execute(
      [
        {
          name: `Expire [${keyName}] at ${at}`,
          task() {
            return self.query(key(self.context)(keyName).expireAt(at));
          },
        },
      ],
      {
        domain: 'Biota.key.expireAt',
      },
    );
  };
};
