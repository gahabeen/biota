import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const expireIn: FactoryKey<FrameworkKeyApi['expireIn']> = function (keyName) {
  const self = this;

  return async (delay) => {
    return execute(
      [
        {
          name: `Expire [${keyName}] delayd of ${delay}ms`,
          task() {
            return self.query(key(self.context)(keyName).expireIn(delay));
          },
        },
      ],
      {
        domain: 'Biota.key.expireIn',
      },
    );
  };
};
