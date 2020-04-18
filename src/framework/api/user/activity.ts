import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { execute } from '~/tools/tasks';

export const activity: FactoryUser<FrameworkUserApi['activity']> = function (idOrRef) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity [${idOrRef}]`,
          async task() {
            return {};
            // return self.user(BiotaCollectionName('actions')).find(
            //   {
            //     user: {
            //       $computed: q.Collection(idOrRef),
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
