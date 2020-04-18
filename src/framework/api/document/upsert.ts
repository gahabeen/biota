import { FactoryDocument } from '~/types/factory/factory.document';
import { FrameworkDocumentApi } from '~/types/framework/framework.document';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export const upsert: FactoryDocument<FrameworkDocumentApi['upsert']> = function (this: Biota, collectionName, id) {
  const self = this;

  return async (data: object) => {
    return execute(
      [
        {
          name: `Update/Insert [${collectionName}/${id}]`,
          task() {
            return self.query(document(self.context)(collectionName, id).upsert(data));
          },
        },
      ],
      {
        domain: 'Biota.document.upsert',
      },
    );
  };
};
