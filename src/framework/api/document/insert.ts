import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';
import { FactoryDocument } from '~/types/factory/factory.document';
import { FrameworkDocumentApi } from '~/types/framework/framework.document';

export const insert: FactoryDocument<FrameworkDocumentApi['insert']> = function (this: Biota, collectionName, id) {
  const self = this;

  return async (data: any) => {
    return execute(
      [
        {
          name: `Insert [${collectionName}] (${id ? id : 'no id'})`,
          task() {
            return self.query(document(self.context)(collectionName, id).insert(data));
          },
        },
      ],
      {
        domain: 'Biota.document.insert',
      },
    );
  };
};
