import { FrameworkDocumentsApi } from 'types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const updateMany: FrameworkDocumentsApi['updateMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Update many documents`,
        task() {
          return self.query(documents(self.context).updateMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.documents.updateMany',
    },
  );
};
