import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const forgetMany: FrameworkDocumentsApi['forgetMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Forget many documents`,
        task() {
          return self.query(documents(self.context).forgetMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.documents.forgetMany',
    },
  );
};
