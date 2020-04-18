import { FactoryIndex } from '~/types/factory/factory.index';
import { FrameworkIndexApi } from '~/types/framework/framework.index';
import { index } from '~/factory/api/index';
import { execute } from '~/tools/tasks';

export const expireIn: FactoryIndex<FrameworkIndexApi['expireIn']> = function (indexName) {
  const self = this;

  return async (delay) => {
    return execute(
      [
        {
          name: `Expire [${indexName}] delayd of ${delay}ms`,
          task() {
            return self.query(index(self.context)(indexName).expireIn(delay));
          },
        },
      ],
      {
        domain: 'Biota.index.expireIn',
      },
    );
  };
};
