import { FrameworkIndexesApi } from 'types/framework/framework.indexes';
import { indexes } from '~/factory/api/indexes';
import { execute } from '~/tools/tasks';

export const searchQuery: FrameworkIndexesApi['searchQuery'] = async function (resource, searchTerms) {
  const self = this;

  return execute(
    [
      {
        name: `Delete many indexes`,
        task() {
          return self.query(indexes(self.context).searchQuery(resource, searchTerms));
        },
      },
    ],
    {
      domain: 'Biota.indexes.searchQuery',
    },
  );
};
