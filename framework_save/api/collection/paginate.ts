import { Biota } from '~/biota';
import { FaunaPaginateMapper, FaunaPaginateOptions, FaunaPaginateResponse, FaunaCollectionOptions } from '~/../types/fauna';
import { execute } from '~/tasks';
import { BiotaFrameworkCollectionSearchParams } from '~/../types/framework/framework.collection';

export function paginate(this: Biota, collectionName: string) {
  const self = this;

  return async function* paginateMethod(
    searchQuery: BiotaFrameworkCollectionSearchParams,
    paginateOptions: FaunaPaginateOptions = {},
    mapper: FaunaPaginateMapper,
  ) {
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
                .find(searchQuery, { ...paginateOptions, after }, mapper)
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
