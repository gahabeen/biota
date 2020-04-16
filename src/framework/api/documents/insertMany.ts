import { FrameworkDocumentsApi } from 'types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const insertMany: FrameworkDocumentsApi['insertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Insert many documents`,
        task() {
          return self.query(documents(self.context).insertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.documents.insertMany',
    },
  );
};
