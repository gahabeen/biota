import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';
import { execute } from '~/tools/tasks';

export const activity: FactoryCredential<FrameworkCredentialApi['activity']> = function (idOrInstance) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity [${idOrInstance}]`,
          async task() {
            return {};
            // return self.credential(BiotaCollectionName('actions')).find(
            //   {
            //     credential: {
            //       $computed: q.Collection(idOrInstance),
            //     },
            //   },
            //   pagination,
            // );
          },
        },
      ],
      {
        domain: 'Biota.credential.activity',
      },
    );
  };
};
