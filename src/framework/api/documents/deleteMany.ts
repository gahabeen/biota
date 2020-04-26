import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';
import { FactoryDocuments } from '~/types/factory/factory.documents';
import { Biota } from '~/biota';

export const deleteMany: FactoryDocuments<FrameworkDocumentsApi['deleteMany']> = function (this: Biota, collectionName) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return async (idList) => {
    return execute(
      [
        {
          name: `Delete many documents in collection [${collectionName}]`,
          task() {
            return self.query(documents(self.context)(collectionName).deleteMany(idList));
          },
        },
      ],
      {
        domain: 'Biota.documents.deleteMany',
      },
    );
  };
};
