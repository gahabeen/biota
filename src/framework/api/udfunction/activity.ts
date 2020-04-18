import { FaunaPaginateOptions } from '~/types/fauna';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { FactoryUDFunction } from '~/types/factory/factory.udfunction';
import { FrameworkUDFunctionApi } from '~/types/framework/framework.udfunction';

export const activity: FactoryUDFunction<FrameworkUDFunctionApi['activity']> = function (udfunctionName) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity for (${udfunctionName})`,
          async task() {
            return {};
            // return self.udfunction(BiotaCollectionName('actions')).find(
            //   {
            //     udfunction: {
            //       $computed: q.Collection(udfunctionName),
            //     },
            //   },
            //   pagination,
            // );
          },
        },
      ],
      {
        domain: 'Biota.udfunction.activity',
      },
    );
  };
};
