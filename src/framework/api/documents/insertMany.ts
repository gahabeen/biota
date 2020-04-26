import { Biota } from '~/biota';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';
import { FactoryDocuments } from '~/types/factory/factory.documents';
import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';

export const insertMany: FactoryDocuments<FrameworkDocumentsApi['insertMany']> = function (this: Biota, collectionName) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return async (optionsList) => {
    return execute(
      [
        {
          name: `Insert many documents in collection [${collectionName}]`,
          task() {
            return self.query(documents(self.context)(collectionName).insertMany(optionsList));
          },
        },
      ],
      {
        domain: 'Biota.documents.insertMany',
      },
    );
  };
};
