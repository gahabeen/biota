import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';
import { FactoryDocument } from 'types/factory/factory.document';
import { FrameworkDocumentApi } from 'types/framework/framework.document';

export const drop: FactoryDocument<FrameworkDocumentApi['drop']> = function (this: Biota, collectionName, id) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Drop [${collectionName}/${id}]`,
          task() {
            return self.query(document(self.context)(collectionName, id).drop());
          },
        },
      ],
      {
        domain: 'Biota.document.drop',
      },
    );
  };
};
