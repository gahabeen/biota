import { FrameworkDocumentsApi } from 'types/framework/framework.documents';
import { documents } from '~/factory/api/documents';
import { execute } from '~/tools/tasks';

export const repsertMany: FrameworkDocumentsApi['repsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many documents`,
        task() {
          return self.query(documents(self.context).repsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.documents.repsertMany',
    },
  );
};
