import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const revoke: FactoryKey<FrameworkKeyApi['revoke']> = function (keyName) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Revoke (${keyName})`,
          task() {
            return self.query(key(self.context)(keyName).revoke());
          },
        },
      ],
      {
        domain: 'Biota.key.revoke',
      },
    );
  };
};
