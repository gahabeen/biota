import { FactoryIndex } from '~/types/factory/factory.index';
import { FrameworkIndexApi } from '~/types/framework/framework.index';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const get: FactoryIndex<FrameworkIndexApi['get']> = function (indexName) {
  const self = this;

  return async function getMethod() {
    return execute(
      [
        {
          name: `Get (${indexName})`,
          task() {
            return self.query(index(self.context)(indexName).get());
          },
        },
      ],
      {
        domain: 'Biota.index.get',
      },
    );
  };
};
