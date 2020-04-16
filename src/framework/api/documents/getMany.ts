import { FrameworkDocumentsApi } from 'types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const getMany: FrameworkDocumentsApi['getMany'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Get many documents`,
        task() {
          return self.query(documents(self.context).getMany(refList));
        },
      },
    ],
    {
      domain: 'Biota.documents.getMany',
    },
  );
};
