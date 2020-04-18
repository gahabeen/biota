import { FactorySession } from '~/types/factory/factory.session';
import { FrameworkSessionApi } from '~/types/framework/framework.session';
import { execute } from '~/tools/tasks';

export const activity: FactorySession<FrameworkSessionApi['activity']> = function (idOrRef) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity [${idOrRef}]`,
          async task() {
            return {};
            // return self.session(BiotaCollectionName('actions')).find(
            //   {
            //     session: {
            //       $computed: q.Collection(idOrRef),
            //     },
            //   },
            //   pagination,
            // );
          },
        },
      ],
      {
        domain: 'Biota.session.activity',
      },
    );
  };
};
