import { FrameworkDocumentsApi } from 'types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const replaceMany: FrameworkDocumentsApi['replaceMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many documents`,
        task() {
          return self.query(documents(self.context).replaceMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.documents.replaceMany',
    },
  );
};
