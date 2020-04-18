import { FactoryDocument } from '~/types/factory/factory.document';
import { FrameworkDocumentApi } from '~/types/framework/framework.document';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

// tslint:disable-next-line: variable-name
export const delete_: FactoryDocument<FrameworkDocumentApi['delete']> = function (this: Biota, collectionName, id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete [${collectionName}/${id}]`,
          task() {
            return self.query(document(self.context)(collectionName, id).delete());
          },
        },
      ],
      {
        domain: 'Biota.document.delete',
      },
    );
  };
};
