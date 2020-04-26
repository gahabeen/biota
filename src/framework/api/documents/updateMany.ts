import { Biota } from '~/biota';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';
import { FactoryDocuments } from '~/types/factory/factory.documents';
import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';

export const updateMany: FactoryDocuments<FrameworkDocumentsApi['updateMany']> = function (this: Biota, collectionName) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return async (optionsList) => {
    return execute(
      [
        {
          name: `Update many documents in collection [${collectionName}]`,
          task() {
            return self.query(documents(self.context)(collectionName).updateMany(optionsList));
          },
        },
      ],
      {
        domain: 'Biota.documents.updateMany',
      },
    );
  };
};
