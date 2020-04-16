import { FrameworkDatabasesApi } from 'types/framework/framework.databases';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';
import { FrameworkDocumentApi } from 'types/framework/framework.document';
import { FactoryDocument } from 'types/factory/factory.document';

export const expireAt: FactoryDocument<FrameworkDocumentApi['expireAt']> = function (collectionName, id) {
  const self = this;

  return async (at) => {
    return execute(
      [
        {
          name: `Expire [${collectionName}/${id}] at ${at}`,
          task() {
            return self.query(document(self.context)(collectionName, id).expireAt(at));
          },
        },
      ],
      {
        domain: 'Biota.document.expireAt',
      },
    );
  };
};
