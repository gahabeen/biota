import { FrameworkDatabasesApi } from '~/types/framework/framework.databases';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';
import { FrameworkDocumentApi } from '~/types/framework/framework.document';
import { FactoryDocument } from '~/types/factory/factory.document';

export const expireIn: FactoryDocument<FrameworkDocumentApi['expireIn']> = function (collectionName, id) {
  const self = this;

  return async (delay) => {
    return execute(
      [
        {
          name: `Expire [${collectionName}/${id}] delayd of ${delay}ms`,
          task() {
            return self.query(document(self.context)(collectionName, id).expireIn(delay));
          },
        },
      ],
      {
        domain: 'Biota.document.expireIn',
      },
    );
  };
};
