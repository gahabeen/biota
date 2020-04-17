import { FactoryIndex } from 'types/factory/factory.index';
import { FrameworkIndexApi } from 'types/framework/framework.index';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const expireNow: FactoryIndex<FrameworkIndexApi['expireNow']> = function (indexName) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${indexName}] now`,
          task() {
            return self.query(index(self.context)(indexName).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.index.expireNow',
      },
    );
  };
};
