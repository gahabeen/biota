import { FaunaPaginateOptions } from '~/types/fauna';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { FactoryKey } from '~/types/factory/factory.key';
import { FrameworkKeyApi } from '~/types/framework/framework.key';

export const activity: FactoryKey<FrameworkKeyApi['activity']> = function (keyName) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity for (${keyName})`,
          async task() {
            return {};
            // return self.key(BiotaCollectionName('actions')).find(
            //   {
            //     key: {
            //       $computed: q.Collection(keyName),
            //     },
            //   },
            //   pagination,
            // );
          },
        },
      ],
      {
        domain: 'Biota.key.activity',
      },
    );
  };
};
