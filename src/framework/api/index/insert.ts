import { FactoryIndex } from '~/types/factory/factory.index';
import { FrameworkIndexApi } from '~/types/framework/framework.index';
import { FaunaId } from '~/types/fauna';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const insert: FactoryIndex<FrameworkIndexApi['insert']> = function (indexName) {
  const self = this;

  return async function insertMethod(data: any = {}, id: FaunaId = null) {
    return execute(
      [
        {
          name: `Insert data in [${indexName}]`,
          task() {
            return self.query(index(self.context)(indexName).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.index.insert',
      },
    );
  };
};
