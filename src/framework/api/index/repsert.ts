import { FactoryIndex } from 'types/factory/factory.index';
import { FrameworkIndexApi } from 'types/framework/framework.index';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const repsert: FactoryIndex<FrameworkIndexApi['repsert']> = function (indexName) {
  const self = this;

  return async function repsertMethod(options) {
    return execute(
      [
        {
          name: `Replace/Insert (${indexName})`,
          task() {
            return self.query(index(self.context)(indexName).repsert(options));
          },
        },
      ],
      {
        domain: 'Biota.index.repsert',
      },
    );
  };
};
