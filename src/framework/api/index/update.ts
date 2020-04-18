import { FactoryIndex } from '~/types/factory/factory.index';
import { FrameworkIndexApi } from '~/types/framework/framework.index';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const update: FactoryIndex<FrameworkIndexApi['update']> = function (indexName) {
  const self = this;

  return async function updateMethod(data) {
    return execute(
      [
        {
          name: `Update (${indexName})`,
          task() {
            return self.query(index(self.context)(indexName).update(data));
          },
        },
      ],
      {
        domain: 'Biota.index.update',
      },
    );
  };
};
