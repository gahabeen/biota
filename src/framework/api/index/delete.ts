import { FactoryIndex } from '~/types/factory/factory.index';
import { FrameworkIndexApi } from '~/types/framework/framework.index';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

// tslint:disable-next-line: variable-name
export const delete_: FactoryIndex<FrameworkIndexApi['delete']> = function (indexName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete (${indexName})`,
          task() {
            return self.query(index(self.context)(indexName).delete());
          },
        },
      ],
      {
        domain: 'Biota.index.delete',
      },
    );
  };
};
