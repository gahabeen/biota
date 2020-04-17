import { FactoryIndex } from 'types/factory/factory.index';
import { FrameworkIndexApi } from 'types/framework/framework.index';
import { execute } from '~/tools/tasks';

export const activity: FactoryIndex<FrameworkIndexApi['activity']> = function (indexName) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity [${indexName}]`,
          async task() {
            return {};
            // return self.index(BiotaCollectionName('actions')).find(
            //   {
            //     index: {
            //       $computed: q.Collection(indexName),
            //     },
            //   },
            //   pagination,
            // );
          },
        },
      ],
      {
        domain: 'Biota.index.activity',
      },
    );
  };
};
