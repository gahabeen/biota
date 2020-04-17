import { FactoryIndex } from 'types/factory/factory.index';
import { FrameworkIndexApi } from 'types/framework/framework.index';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const replace: FactoryIndex<FrameworkIndexApi['replace']> = function (indexName) {
  const self = this;

  return async function replaceMethod(options) {
    return execute(
      [
        {
          name: `Replace (${indexName})`,
          task() {
            return self.query(index(self.context)(indexName).replace(options));
          },
        },
      ],
      {
        domain: 'Biota.index.replace',
      },
    );
  };
};
