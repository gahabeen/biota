import { FactoryDocument } from 'types/factory/factory.document';
import { FrameworkDocumentApi } from 'types/framework/framework.document';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export const get: FactoryDocument<FrameworkDocumentApi['get']> = function (this: Biota, collectionName, id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Get (${id}) in (${collectionName})`,
          task() {
            return self.query(document(self.context)(collectionName, id).get());
          },
        },
      ],
      {
        domain: 'Biota.document.get',
      },
    );
  };
};
