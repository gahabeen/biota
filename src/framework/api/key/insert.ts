import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';
import { FaunaId } from '~/types/fauna';
import { key } from '~/factory/api/key';
import { execute } from '~/tools/tasks';

export const insert: FactoryKey<FrameworkKeyApi['insert']> = function (keyName) {
  const self = this;

  return async function insertMethod(data: any = {}, id: FaunaId = null) {
    return execute(
      [
        {
          name: `Insert data in [${keyName}]`,
          task() {
            return self.query(key(self.context)(keyName).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.key.insert',
      },
    );
  };
};
