import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const deleteMany: FrameworkDocumentsApi['deleteMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Delete many documents`,
        task() {
          return self.query(documents(self.context).deleteMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.documents.deleteMany',
    },
  );
};
