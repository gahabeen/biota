import { FrameworkDocumentsApi } from 'types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const expireManyAt: FrameworkDocumentsApi['expireManyAt'] = async function (refList, at) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many documents at ${at}`,
        task() {
          return self.query(documents(self.context).expireManyAt(refList, at));
        },
      },
    ],
    {
      domain: 'Biota.documents.expireManyAt',
    },
  );
};
