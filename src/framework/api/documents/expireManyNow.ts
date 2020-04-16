import { FrameworkDocumentsApi } from 'types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const expireManyNow: FrameworkDocumentsApi['expireManyNow'] = async function (refList) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many documents now`,
        task() {
          return self.query(documents(self.context).expireManyNow(refList));
        },
      },
    ],
    {
      domain: 'Biota.documents.expireManyNow',
    },
  );
};
