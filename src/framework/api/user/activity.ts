import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { execute } from '~/tools/tasks';

export const activity: FactoryUser<FrameworkUserApi['activity']> = function (id) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity [${id}]`,
          async task() {
            return {};
            // return self.user(BiotaCollectionName('actions')).find(
            //   {
            //     user: {
            //       $computed: q.Collection(id),
            //     },
            //   },
            //   pagination,
            // );
          },
        },
      ],
      {
        domain: 'Biota.user.activity',
      },
    );
  };
};
