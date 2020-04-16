import { FrameworkDocumentsApi } from 'types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const restoreMany: FrameworkDocumentsApi['restoreMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Restore many documents`,
        task() {
          return self.query(documents(self.context).restoreMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.documents.restoreMany',
    },
  );
};
