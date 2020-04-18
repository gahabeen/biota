import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkDocumentsApi['findAll'] = async function (collectionName, pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all documents`,
        task() {
          return self.query(documents(self.context).findAll(collectionName, pagination));
        },
      },
    ],
    {
      domain: 'Biota.documents.findAll',
    },
  );
};
