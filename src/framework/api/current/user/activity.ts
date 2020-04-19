import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { execute } from '~/tools/tasks';

export const currentUserActivity: FactoryUser<FrameworkUserApi['activity']> = function (id = null) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity of current user`,
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
        domain: 'Biota.current.user.activity',
      },
    );
  };
};
