import { DB } from "~/db";
import {
  FaunaPaginateMapper,
  FaunaPaginateOptions,
  FaunaPaginateResponse,
  FaunaCollectionOptions,
  DBFrameworkCollectionSearchParams
} from "~/../types/db";
import { execute } from "~/tasks";

export function paginate(this: DB, collectionDefinition: FaunaCollectionOptions) {
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
            name: `Paginate after ${after} in (${collectionDefinition.name})`,
            async task() {
              return self
                .collection(collectionDefinition.name)
                .find(searchQuery, { ...paginateOptions, after }, mapper)
                .then((res: FaunaPaginateResponse) => {
                  if (res.after) {
                    after = res.after;
                  } else {
                    after = undefined;
                  }
                  return res;
                });
            }
          }
        ],
        {
          domain: "DB.collection.paginate"
        }
      );
    }
  };
}
