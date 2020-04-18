import { query as q } from 'faunadb';
import { FactoryDocument } from '~/types/factory/factory.document';
import { FrameworkDocumentApi } from '~/types/framework/framework.document';
import { Biota } from '~/biota';
import { BiotaCollectionName } from '~/factory/constructors/collection';
import { execute } from '~/tools/tasks';

export const activity: FactoryDocument<FrameworkDocumentApi['activity']> = function (this: Biota, collectionName, id) {
  const self = this;

  return async (pagination = {}) => {
    return execute(
      [
        {
          name: `Activity for [${collectionName}/${id}]`,
          async task() {
            return self.collection(BiotaCollectionName('actions')).find(
              {
                instance: q.Ref(q.Collection(collectionName), id),
              },
              pagination,
            );
          },
        },
      ],
      {
        domain: 'Biota.document.activity',
      },
    );
  };
};
