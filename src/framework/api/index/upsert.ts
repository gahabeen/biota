import { FactoryIndex } from '~/types/factory/factory.index';
import { FrameworkIndexApi } from '~/types/framework/framework.index';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const upsert: FactoryIndex<FrameworkIndexApi['upsert']> = function (indexName) {
  const self = this;

  return async function upsertMethod(data) {
    return execute(
      [
        {
          name: `Update/Insert (${indexName})`,
          task() {
            return self.query(index(self.context)(indexName).upsert(data));
          },
        },
      ],
      {
        domain: 'Biota.index.upsert',
      },
    );
  };
};
