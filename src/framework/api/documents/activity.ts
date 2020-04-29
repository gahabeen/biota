import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';
import { FactoryDocuments } from '~/types/factory/factory.documents';
import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';

export const activity: FactoryDocuments<FrameworkDocumentsApi['activity']> = function (this: Biota, collectionName) {
  const self = this;

  return async (pagination) => {
    return execute(
      [
        {
          name: `Activity for documents in collection [${collectionName}]`,
          async task() {
            return {};
            // return self.query(documents(self.context)(collectionName).activity(pagination));
          },
        },
      ],
      {
        domain: 'Biota.document.expireAt',
      },
    );
  };
};
