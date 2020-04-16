import { FaunaId } from '~/../types/fauna';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';
import { FactoryDocument } from 'types/factory/factory.document';
import { FrameworkDocumentApi } from 'types/framework/framework.document';

export const forget: FactoryDocument<FrameworkDocumentApi['forget']> = function (this: Biota, collectionName, id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Forget [${collectionName}/${id}]`,
          task() {
            return self.query(document(self.context)(collectionName, id).forget());
          },
        },
      ],
      {
        domain: 'Biota.document.forget',
      },
    );
  };
};
