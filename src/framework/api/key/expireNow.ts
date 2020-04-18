import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const expireNow: FactoryKey<FrameworkKeyApi['expireNow']> = function (keyName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${keyName}] now`,
          task() {
            return self.query(key(self.context)(keyName).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.key.expireNow',
      },
    );
  };
};
