// types
import {
  Fauna,
  FaunaPaginateResponse,
  FaunaPaginateOptions
} from "~/../types/db";
// external
import { query as q } from "faunadb";
import { DB } from "~/db";

export function* paginate(
  this: DB,
  paginateQuery: Fauna.Expr,
  paginateOptions: FaunaPaginateOptions = {}
) {
  let after: any = Infinity;
  while (after) {
    yield this.client
      .query(q.Paginate(paginateQuery, paginateOptions))
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
