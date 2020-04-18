import { FaunaPaginateOptions } from '~/types/fauna';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { FactoryRole } from '~/types/factory/factory.role';
import { FrameworkRoleApi } from '~/types/framework/framework.role';

export const activity: FactoryRole<FrameworkRoleApi['activity']> = function (roleName) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity for (${roleName})`,
          async task() {
            return {};
            // return self.role(BiotaCollectionName('actions')).find(
            //   {
            //     role: {
            //       $computed: q.Collection(roleName),
            //     },
            //   },
            //   pagination,
            // );
          },
        },
      ],
      {
        domain: 'Biota.role.activity',
      },
    );
  };
};
