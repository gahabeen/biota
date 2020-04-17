import { FactoryIndex } from 'types/factory/factory.index';
import { FrameworkIndexApi } from 'types/framework/framework.index';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const forget: FactoryIndex<FrameworkIndexApi['forget']> = function (indexName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget (${indexName})`,
          task() {
            return self.query(index(self.context)(indexName).forget());
          },
        },
      ],
      {
        domain: 'Biota.index.forget',
      },
    );
  };
};
