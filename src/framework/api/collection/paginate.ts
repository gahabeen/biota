import { DB } from "~/db";
import { FaunaPaginateMapper, FaunaPaginateOptions, FaunaPaginateResponse, FaunaCollectionOptions } from "~/../types/fauna";
import { execute } from "~/tasks";
import { DBFrameworkCollectionSearchParams } from "~/../types/framework/framework.collection";

export function paginate(this: DB, collectionName: string) {
  let self = this;

  return async function* paginateMethod(
    searchQuery: DBFrameworkCollectionSearchParams,
    paginateOptions: FaunaPaginateOptions = {},
    mapper: FaunaPaginateMapper
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
          domain: "DB.collection.paginate",
        }
      );
    }
  };
}
