import { query as q } from 'faunadb';
import { FactoryToken } from '~/types/factory/factory.token';
import { FrameworkTokenApi } from '~/types/framework/framework.token';
import { Biota } from '~/biota';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { execute } from '~/tools/tasks';

export const activity: FactoryToken<FrameworkTokenApi['activity']> = function (this: Biota, idOrRefOrInstance) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity for [${idOrRefOrInstance}]`,
          async task() {
            return {}
            // return self.collection(BiotaCollectionName('actions')).find(
            //   {
            //     instance: q.Ref(q.Collection(collectionName), id),
            //   },
            //   pagination,
            // );
          },
        },
      ],
      {
        domain: 'Biota.token.activity',
      },
    );
  };
};
