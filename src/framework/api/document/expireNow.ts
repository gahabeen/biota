import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';
import { FrameworkDocumentApi } from '~/types/framework/framework.document';
import { FactoryDocument } from '~/types/factory/factory.document';

export const expireNow: FactoryDocument<FrameworkDocumentApi['expireNow']> = function (collectionName, id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Expire [${collectionName}/${id}] now`,
          task() {
            return self.query(document(self.context)(collectionName, id).expireNow());
          },
        },
      ],
      {
        domain: 'Biota.document.expireNow',
      },
    );
  };
};
