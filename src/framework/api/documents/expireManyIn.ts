import { Biota } from '~/biota';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';
import { FactoryDocuments } from '~/types/factory/factory.documents';
import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';

export const expireManyIn: FactoryDocuments<FrameworkDocumentsApi['expireManyIn']> = function (this: Biota, collectionName) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return async (idList, delay) => {
    return execute(
      [
        {
          name: `Expire many documents in ${delay}ms in collection [${collectionName}]`,
          task() {
            return self.query(documents(self.context)(collectionName).expireManyIn(idList, delay));
          },
        },
      ],
      {
        domain: 'Biota.documents.expireManyIn',
      },
    );
  };
};
