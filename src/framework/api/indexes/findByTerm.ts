import { FrameworkIndexesApi } from 'types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const findByTerm: FrameworkIndexesApi['findByTerm'] = async function (term = null, pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find by term`,
        task() {
          return self.query(indexes(self.context).findByTerm(term, pagination));
        },
      },
    ],
    {
      domain: 'Biota.indexes.findByTerm',
    },
  );
};
