import { FrameworkDocumentsApi } from 'types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkDocumentsApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many documents`,
        task() {
          return self.query(documents(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.documents.upsertMany',
    },
  );
};
