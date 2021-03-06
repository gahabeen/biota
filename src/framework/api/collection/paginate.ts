import { Biota } from '~/biota';
import { FaunaPaginateMapper, FaunaPaginateOptions, FaunaPaginateResponse, FaunaCollectionOptions } from '~/types/fauna';
import { execute } from '~/tools/tasks';
import { FrameworkCollectionSearchParams } from '~/types/framework/framework.collection';

export function paginate(this: Biota, collectionName: string) {
  const self = this;

  return async function* paginateMethod(searchQuery: FrameworkCollectionSearchParams, paginateOptions: FaunaPaginateOptions = {}) {
    let firstRequest = true;
    let after: any;

    while (after || firstRequest) {
      if (firstRequest) firstRequest = false;
      yield execute(
        [
          {
            name: `Paginate after ${after} in (${collectionName})`,
            async task() {
              return self
                .collection(collectionName)
                .find(searchQuery, { ...paginateOptions, after })
                .then((res: FaunaPaginateResponse) => {
                  if (res.after) {
                    after = res.after;
                  } else {
                    after = undefined;
                  }
                  return res;
                });
            },
          },
        ],
        {
          domain: 'Biota.collection.paginate',
        },
      );
    }
  };
}
