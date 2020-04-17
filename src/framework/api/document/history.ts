import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';
import { FactoryDocument } from 'types/factory/factory.document';
import { FrameworkDocumentApi } from 'types/framework/framework.document';

export const history: FactoryDocument<FrameworkDocumentApi['history']> = function (this: Biota, collectionName, id) {
  const self = this;

  return async (pagination) => {
    return execute(
      [
        {
          name: `History of [${collectionName}/${id}]`,
          task() {
            return self.query(document(self.context)(collectionName, id).history(pagination));
          },
        },
      ],
      {
        domain: 'Biota.document.history',
      },
    );
  };
};
