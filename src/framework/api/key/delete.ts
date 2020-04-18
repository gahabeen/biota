import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

// tslint:disable-next-line: variable-name
export const delete_: FactoryKey<FrameworkKeyApi['delete']> = function (keyName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete (${keyName})`,
          task() {
            return self.query(key(self.context)(keyName).delete());
          },
        },
      ],
      {
        domain: 'Biota.key.delete',
      },
    );
  };
};
