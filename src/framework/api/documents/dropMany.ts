import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const dropMany: FrameworkDocumentsApi['dropMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Drop many documents`,
        task() {
          return self.query(documents(self.context).dropMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.documents.dropMany',
    },
  );
};
