import { FrameworkIndexesApi } from '~/types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const expireManyIn: FrameworkIndexesApi['expireManyIn'] = async function (nameList, delay) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many indexes in ${delay}ms`,
        task() {
          return self.query(indexes(self.context).expireManyIn(nameList, delay));
        },
      },
    ],
    {
      domain: 'Biota.indexes.expireManyIn',
    },
  );
};
