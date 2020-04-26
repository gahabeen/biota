import { Biota } from '~/biota';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';
import { FactoryDocuments } from '~/types/factory/factory.documents';
import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';

export const restoreMany: FactoryDocuments<FrameworkDocumentsApi['restoreMany']> = function (this: Biota, collectionName) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return async (idList) => {
    return execute(
      [
        {
          name: `Restore many documents in collection [${collectionName}]`,
          task() {
            return self.query(documents(self.context)(collectionName).restoreMany(idList));
          },
        },
      ],
      {
        domain: 'Biota.documents.restoreMany',
      },
    );
  };
};
