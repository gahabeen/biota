import { Biota } from '~/biota';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';
import { FactoryDocuments } from '~/types/factory/factory.documents';
import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';

export const expireManyAt: FactoryDocuments<FrameworkDocumentsApi['expireManyAt']> = function (this: Biota, collectionName) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return async (idList, at) => {
    return execute(
      [
        {
          name: `Drop many documents in collection [${collectionName}]`,
          task() {
            return self.query(documents(self.context)(collectionName).expireManyAt(idList, at));
          },
        },
      ],
      {
        domain: 'Biota.documents.expireManyAt',
      },
    );
  };
};
