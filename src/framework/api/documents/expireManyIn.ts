import { FrameworkDocumentsApi } from '~/types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const expireManyIn: FrameworkDocumentsApi['expireManyIn'] = async function (refList, delay) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many documents in ${delay}ms`,
        task() {
          return self.query(documents(self.context).expireManyIn(refList, delay));
        },
      },
    ],
    {
      domain: 'Biota.documents.expireManyIn',
    },
  );
};
