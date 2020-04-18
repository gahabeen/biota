import { FactoryDocument } from '~/types/factory/factory.document';
import { FrameworkDocumentApi } from '~/types/framework/framework.document';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export const restore: FactoryDocument<FrameworkDocumentApi['restore']> = function (this: Biota, collectionName, id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Restore [${collectionName}/${id}]`,
          task() {
            return self.query(document(self.context)(collectionName, id).restore());
          },
        },
      ],
      {
        domain: 'Biota.document.restore',
      },
    );
  };
};
