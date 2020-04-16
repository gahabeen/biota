import { FactoryDocument } from 'types/factory/factory.document';
import { FrameworkDocumentApi } from 'types/framework/framework.document';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export const replace: FactoryDocument<FrameworkDocumentApi['replace']> = function (this: Biota, collectionName, id) {
  const self = this;

  return async (data: object) => {
    return execute(
      [
        {
          name: `Replace [${collectionName}/${id}]`,
          task() {
            return self.query(document(self.context)(collectionName, id).replace(data));
          },
        },
      ],
      {
        domain: 'Biota.document.replace',
      },
    );
  };
};
