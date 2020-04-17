import { FactoryIndex } from 'types/factory/factory.index';
import { FrameworkIndexApi } from 'types/framework/framework.index';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const drop: FactoryIndex<FrameworkIndexApi['drop']> = function (indexName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop (${indexName})`,
          task() {
            return self.query(index(self.context)(indexName).drop());
          },
        },
      ],
      {
        domain: 'Biota.index.drop',
      },
    );
  };
};
