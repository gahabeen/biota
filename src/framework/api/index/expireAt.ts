import { FactoryIndex } from '~/types/factory/factory.index';
import { FrameworkIndexApi } from '~/types/framework/framework.index';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const expireAt: FactoryIndex<FrameworkIndexApi['expireAt']> = function (indexName) {
  const self = this;

  return async (at) => {
    return execute(
      [
        {
          name: `Expire [${indexName}] at ${at}`,
          task() {
            return self.query(index(self.context)(indexName).expireAt(at));
          },
        },
      ],
      {
        domain: 'Biota.index.expireAt',
      },
    );
  };
};
