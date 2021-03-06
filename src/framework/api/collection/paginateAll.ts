import { FaunaPaginateMapper, FaunaPaginateOptions, FaunaPaginateResponse } from '~/types/fauna';
import { Biota } from '~/biota';
import { execute } from '~/tools/tasks';

export function paginateAll(this: Biota, collectionName: string) {
  const self = this;

  return async function* paginateAllMethod(paginateOptions: FaunaPaginateOptions = {}) {
    let firstRequest = true;
    let after: any;

    while (after || firstRequest) {
      if (firstRequest) firstRequest = false;
      yield execute(
        [
          {
            name: `Paginate all documents after ${after} in (${collectionName})`,
            async task() {
              return self
                .collection(collectionName)
                .findAll({ ...paginateOptions, after })
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
          domain: 'Biota.collection.paginateAll',
        },
      );
    }
  };
}
