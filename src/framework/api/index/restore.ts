import { FactoryIndex } from '~/types/factory/factory.index';
import { FrameworkIndexApi } from '~/types/framework/framework.index';
import { Biota } from '~/biota';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const restore: FactoryIndex<FrameworkIndexApi['restore']> = function (this: Biota, indexName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore [${indexName}]`,
          task() {
            return self.query(index(self.context)(indexName).restore());
          },
        },
      ],
      {
        domain: 'Biota.index.restore',
      },
    );
  };
};
